import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import {
  AnalysisResult,
  AnalysisSettings,
  ColorBuckets,
  EMPTY_BUCKETS,
  PageAnalysis,
  OverallCoverage,
  CMYKInkLoad,
  PageSize,
} from "../shared/schema.js";

const execAsync = promisify(exec);
const MAX_ANALYSIS_PIXELS = 4_000_000; // cap per-page raster to ~4MP for analysis speed

export interface DetectedPDFInfo {
  pageCount: number;
  widthMM: number;
  heightMM: number;
}

export class DocumentAnalysisEngine {
  async analyzeDocument(
    filePath: string,
    mimeType: string,
    settings: AnalysisSettings,
  ): Promise<AnalysisResult> {
    const isPDF = mimeType === "application/pdf";
    const isEPS = mimeType === "application/postscript";

    let pageCount = 1;
    if (isPDF || isEPS) {
      try {
        const info = await this.getPDFInfo(filePath);
        pageCount = info.pageCount;
      } catch {
        pageCount = 1;
      }
    }

    const pageBreakdown: PageAnalysis[] = [];
    const inkLoadByPage: CMYKInkLoad[] = await this.tryGhostscriptInkcov(filePath, isPDF || isEPS).catch(() => []);

    for (let i = 0; i < pageCount; i++) {
      const page = await this.analyzeSinglePage(filePath, mimeType, i, settings);
      if (inkLoadByPage[i]) page.inkLoad = inkLoadByPage[i];
      pageBreakdown.push(page);
    }

    const overallCoverage = this.aggregate(pageBreakdown);
    return {
      totalPages: pageCount,
      settings,
      overallCoverage,
      pageBreakdown,
    };
  }

  // ── PDF metadata for prefill ────────────────────────────────────────────────
  async getPDFInfo(filePath: string): Promise<DetectedPDFInfo> {
    const { stdout } = await execAsync(`pdfinfo "${filePath}"`);
    const pageMatch = stdout.match(/Pages:\s*(\d+)/);
    const sizeMatch = stdout.match(/Page size:\s*([\d.]+)\s*x\s*([\d.]+)\s*pts/);
    const pageCount = pageMatch ? parseInt(pageMatch[1], 10) : 1;
    let widthMM = 210, heightMM = 297;
    if (sizeMatch) {
      const wPts = parseFloat(sizeMatch[1]);
      const hPts = parseFloat(sizeMatch[2]);
      widthMM = +(wPts * 25.4 / 72).toFixed(2);
      heightMM = +(hPts * 25.4 / 72).toFixed(2);
    }
    return { pageCount, widthMM, heightMM };
  }

  // ── Per-page analysis ───────────────────────────────────────────────────────
  private async analyzeSinglePage(
    filePath: string,
    mimeType: string,
    pageIndex: number,
    settings: AnalysisSettings,
  ): Promise<PageAnalysis> {
    const tempDir = path.join(process.cwd(), "temp");
    await fs.mkdir(tempDir, { recursive: true });
    const stamp = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const renderPath = path.join(tempDir, `render_${pageIndex}_${stamp}.png`);

    const { widthPx, heightPx } = this.targetPixels(settings);

    try {
      await this.renderPage(filePath, mimeType, pageIndex, renderPath, settings, widthPx, heightPx);
      const { buckets } = await this.classifyImage(renderPath, settings.colorMode);
      // Round each bucket and derive total/blank as residuals so displayed values
      // are mutually exclusive AND always sum to exactly 100% within rounding.
      const rounded = roundBuckets(buckets);
      const totalCoverage = round2(
        (Object.keys(rounded) as (keyof ColorBuckets)[]).reduce((s, k) => s + rounded[k], 0),
      );
      return {
        page: pageIndex + 1,
        totalCoverage,
        blankArea: round2(100 - totalCoverage),
        colors: rounded,
      };
    } finally {
      try { await fs.unlink(renderPath); } catch {}
    }
  }

  private targetPixels(settings: AnalysisSettings): { widthPx: number; heightPx: number } {
    const { widthMM, heightMM } = settings.pageSize;
    const dpi = settings.resolutionDPI;
    let wPx = Math.max(1, Math.round((widthMM / 25.4) * dpi));
    let hPx = Math.max(1, Math.round((heightMM / 25.4) * dpi));
    const total = wPx * hPx;
    if (total > MAX_ANALYSIS_PIXELS) {
      const scale = Math.sqrt(MAX_ANALYSIS_PIXELS / total);
      wPx = Math.max(1, Math.round(wPx * scale));
      hPx = Math.max(1, Math.round(hPx * scale));
    }
    return { widthPx: wPx, heightPx: hPx };
  }

  private async renderPage(
    filePath: string,
    mimeType: string,
    pageIndex: number,
    outPath: string,
    settings: AnalysisSettings,
    widthPx: number,
    heightPx: number,
  ): Promise<void> {
    const dpi = settings.resolutionDPI;
    const isPDFLike = mimeType === "application/pdf" || mimeType === "application/postscript";
    const inputSpec = isPDFLike ? `"${filePath}[${pageIndex}]"` : `"${filePath}"`;

    // Render at DPI, composite onto a white page-sized canvas, then resize down to analysis pixels.
    // We use -extent to fit content into the chosen page size (centered, white background).
    const cmd = [
      "convert",
      `-density ${Math.min(dpi, 300)}`, // render quality cap; analysis still uses page-area ratios
      "-background white",
      "-alpha remove",
      "-alpha off",
      inputSpec,
      "-colorspace sRGB",
      `-resize ${widthPx}x${heightPx}`,
      "-gravity center",
      `-extent ${widthPx}x${heightPx}`,
      `"${outPath}"`,
    ].join(" ");

    await execAsync(cmd);
  }

  // ── Per-pixel classification into mutually exclusive page buckets ──────────
  private async classifyImage(
    pngPath: string,
    colorMode: "color" | "bw",
  ): Promise<{ buckets: ColorBuckets }> {
    // Get raw RGB bytes
    const { stdout: dimOut } = await execAsync(`identify -format "%w %h" "${pngPath}"`);
    const [wStr, hStr] = dimOut.trim().split(/\s+/);
    const width = parseInt(wStr, 10);
    const height = parseInt(hStr, 10);
    const totalPixels = width * height;

    const { stdout } = await execAsync(`convert "${pngPath}" -depth 8 RGB:-`, {
      maxBuffer: 256 * 1024 * 1024,
      encoding: "buffer" as any,
    } as any);
    const buf: Buffer = stdout as unknown as Buffer;

    const counts: Record<keyof ColorBuckets, number> = {
      black: 0, cyan: 0, magenta: 0, yellow: 0,
      red: 0, green: 0, blue: 0, gray: 0, other: 0,
    };
    let covered = 0;

    const len = Math.min(buf.length, totalPixels * 3);
    for (let i = 0; i < len; i += 3) {
      const r = buf[i], g = buf[i + 1], b = buf[i + 2];
      const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
      const min = r < g ? (r < b ? r : b) : (g < b ? g : b);

      // Blank/paper detection: very bright AND nearly grey
      if (min >= 245 && max - min <= 8) {
        continue;
      }
      covered++;

      if (colorMode === "bw") {
        counts.black++;
        continue;
      }

      const sat = max === 0 ? 0 : (max - min) / max;
      const value = max / 255;

      if (value < 0.18) {
        counts.black++;
        continue;
      }
      if (sat < 0.18) {
        if (value < 0.40) counts.black++;
        else counts.gray++;
        continue;
      }

      // Hue (degrees 0-360)
      const d = max - min;
      let h: number;
      if (max === r) h = 60 * (((g - b) / d) % 6);
      else if (max === g) h = 60 * (((b - r) / d) + 2);
      else h = 60 * (((r - g) / d) + 4);
      if (h < 0) h += 360;

      if (h < 18 || h >= 340) counts.red++;
      else if (h < 40) counts.other++;          // orange-ish
      else if (h < 70) counts.yellow++;
      else if (h < 160) counts.green++;
      else if (h < 200) counts.cyan++;
      else if (h < 260) counts.blue++;
      else if (h < 290) counts.magenta++;
      else if (h < 340) counts.magenta++;
      else counts.other++;
    }

    const buckets: ColorBuckets = { ...EMPTY_BUCKETS };
    (Object.keys(counts) as (keyof ColorBuckets)[]).forEach((k) => {
      buckets[k] = (counts[k] / totalPixels) * 100;
    });
    return { buckets };
  }

  // ── Optional: read additive CMYK ink-load via Ghostscript (advanced data) ──
  private async tryGhostscriptInkcov(filePath: string, supported: boolean): Promise<CMYKInkLoad[]> {
    if (!supported) return [];
    try {
      const { stdout } = await execAsync(
        `gs -q -dBATCH -dNOPAUSE -sDEVICE=inkcov -sOutputFile=/dev/null "${filePath}" 2>&1`,
      );
      const lines = stdout.split("\n").filter((l) => l.includes("CMYK"));
      return lines.map((line) => {
        const parts = line.trim().split(/\s+/);
        return {
          cyan: round2(parseFloat(parts[0]) * 100),
          magenta: round2(parseFloat(parts[1]) * 100),
          yellow: round2(parseFloat(parts[2]) * 100),
          black: round2(parseFloat(parts[3]) * 100),
        };
      });
    } catch {
      return [];
    }
  }

  // ── Aggregate (document averages) ──────────────────────────────────────────
  private aggregate(pages: PageAnalysis[]): OverallCoverage {
    if (pages.length === 0) {
      return { totalCoverage: 0, blankArea: 100, colors: { ...EMPTY_BUCKETS } };
    }
    const sumColors: ColorBuckets = { ...EMPTY_BUCKETS };
    let sumCov = 0;
    let sumInk: CMYKInkLoad = { cyan: 0, magenta: 0, yellow: 0, black: 0 };
    let inkPages = 0;
    for (const p of pages) {
      sumCov += p.totalCoverage;
      (Object.keys(sumColors) as (keyof ColorBuckets)[]).forEach((k) => {
        sumColors[k] += p.colors[k];
      });
      if (p.inkLoad) {
        sumInk.cyan += p.inkLoad.cyan;
        sumInk.magenta += p.inkLoad.magenta;
        sumInk.yellow += p.inkLoad.yellow;
        sumInk.black += p.inkLoad.black;
        inkPages++;
      }
    }
    const n = pages.length;
    const colors = roundBuckets(divideBuckets(sumColors, n));
    // Recompute total from rounded color buckets so total == sum(colors) exactly.
    const totalCoverage = round2(
      (Object.keys(colors) as (keyof ColorBuckets)[]).reduce((s, k) => s + colors[k], 0),
    );
    const result: OverallCoverage = {
      totalCoverage,
      blankArea: round2(100 - totalCoverage),
      colors,
    };
    if (inkPages > 0) {
      result.inkLoad = {
        cyan: round2(sumInk.cyan / inkPages),
        magenta: round2(sumInk.magenta / inkPages),
        yellow: round2(sumInk.yellow / inkPages),
        black: round2(sumInk.black / inkPages),
      };
    }
    return result;
  }
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}
function divideBuckets(b: ColorBuckets, n: number): ColorBuckets {
  const out: ColorBuckets = { ...EMPTY_BUCKETS };
  (Object.keys(b) as (keyof ColorBuckets)[]).forEach((k) => { out[k] = b[k] / n; });
  return out;
}
function roundBuckets(b: ColorBuckets): ColorBuckets {
  const out: ColorBuckets = { ...EMPTY_BUCKETS };
  (Object.keys(b) as (keyof ColorBuckets)[]).forEach((k) => { out[k] = round2(b[k]); });
  return out;
}
