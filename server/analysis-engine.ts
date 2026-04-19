import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import {
  AnalysisResult,
  AnalysisSettings,
  ChannelCoverage,
  PageAnalysis,
  OverallCoverage,
} from "../shared/schema.js";

const execAsync = promisify(exec);
const MAX_ANALYSIS_PIXELS = 4_000_000;

export interface DetectedPDFInfo {
  pageCount: number;
  widthMM: number;
  heightMM: number;
}

interface RawCMYK { c: number; m: number; y: number; k: number; coveragePercent: number; }

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

    // Try Ghostscript inkcov first (most accurate per-channel CMYK for PDFs).
    const inkcovPages: Omit<RawCMYK, "coveragePercent">[] = isPDF
      ? await this.tryGhostscriptInkcov(filePath, pageCount).catch(() => [])
      : [];

    const pageBreakdown: PageAnalysis[] = [];
    for (let i = 0; i < pageCount; i++) {
      // Always do a pixel pass — gives us inked-area % (capped at 100) and
      // serves as the per-channel source when inkcov is unavailable.
      const pixel = await this.analyzePixelsCMYK(filePath, mimeType, i, settings);
      let raw: RawCMYK;
      if (inkcovPages[i]) {
        raw = { ...inkcovPages[i], coveragePercent: pixel.coveragePercent };
      } else {
        raw = pixel;
      }
      pageBreakdown.push({
        page: i + 1,
        channels: this.shapeChannels(raw, settings),
        coveragePercent: round2(raw.coveragePercent),
      });
    }

    const overallCoverage = this.aggregate(pageBreakdown, settings);
    return { totalPages: pageCount, settings, overallCoverage, pageBreakdown };
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

  // ── Ghostscript inkcov: real per-channel ink coverage from PDF colorspace ──
  private async tryGhostscriptInkcov(filePath: string, expectedPages: number): Promise<Omit<RawCMYK, "coveragePercent">[]> {
    try {
      const { stdout } = await execAsync(
        `gs -q -dBATCH -dNOPAUSE -sDEVICE=inkcov -sOutputFile=/dev/null "${filePath}" 2>&1`,
        { maxBuffer: 32 * 1024 * 1024 },
      );
      const lines = stdout.split("\n").filter((l) => l.includes("CMYK"));
      const pages = lines.map((line) => {
        const parts = line.trim().split(/\s+/);
        return {
          c: parseFloat(parts[0]) * 100,
          m: parseFloat(parts[1]) * 100,
          y: parseFloat(parts[2]) * 100,
          k: parseFloat(parts[3]) * 100,
        };
      });
      if (pages.length === 0 || pages.length < expectedPages) return [];
      return pages;
    } catch {
      return [];
    }
  }

  // ── Pixel-based CMYK analysis (images, EPS, or PDF fallback) ───────────────
  private async analyzePixelsCMYK(
    filePath: string,
    mimeType: string,
    pageIndex: number,
    settings: AnalysisSettings,
  ): Promise<RawCMYK> {
    const tempDir = path.join(process.cwd(), "temp");
    await fs.mkdir(tempDir, { recursive: true });
    const stamp = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const renderPath = path.join(tempDir, `render_${pageIndex}_${stamp}.png`);
    const { widthPx, heightPx } = this.targetPixels(settings);

    try {
      await this.renderPage(filePath, mimeType, pageIndex, renderPath, settings, widthPx, heightPx);
      return await this.classifyImageCMYK(renderPath);
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

    const cmd = [
      "convert",
      `-density ${Math.min(dpi, 300)}`,
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

  /**
   * Sum the C, M, Y, K ink "load" each pixel needs.
   * Each channel's coverage % = (sum of channel value [0..1] across all pixels)
   * / totalPixels * 100. Channels are independent (additive per cartridge).
   */
  private async classifyImageCMYK(pngPath: string): Promise<RawCMYK> {
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

    let sumC = 0, sumM = 0, sumY = 0, sumK = 0;
    let inkedPixels = 0;
    const len = Math.min(buf.length, totalPixels * 3);

    for (let i = 0; i < len; i += 3) {
      const r = buf[i], g = buf[i + 1], b = buf[i + 2];
      const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
      const min = r < g ? (r < b ? r : b) : (g < b ? g : b);

      // Skip near-white paper (no ink).
      if (min >= 245 && max - min <= 8) continue;
      inkedPixels++;

      // RGB -> CMYK [0..1]
      const k = 1 - max / 255;
      const denom = 1 - k;
      let c = 0, m = 0, y = 0;
      if (denom > 0.001) {
        c = (1 - r / 255 - k) / denom;
        m = (1 - g / 255 - k) / denom;
        y = (1 - b / 255 - k) / denom;
      }
      sumC += c;
      sumM += m;
      sumY += y;
      sumK += k;
    }

    return {
      c: (sumC / totalPixels) * 100,
      m: (sumM / totalPixels) * 100,
      y: (sumY / totalPixels) * 100,
      k: (sumK / totalPixels) * 100,
      coveragePercent: (inkedPixels / totalPixels) * 100,
    };
  }

  // ── Shape raw CMYK into the channels the user actually wants to see ────────
  private shapeChannels(raw: RawCMYK, settings: AnalysisSettings): ChannelCoverage {
    const { printerType, colorMode } = settings;
    if (colorMode === "bw") {
      // Only the black cartridge is used for B&W output.
      // Use the union of any ink darkness so plain-color pixels still register.
      const blackEquivalent = Math.max(raw.k, (raw.c + raw.m + raw.y) / 3);
      return { black: round2(blackEquivalent) };
    }
    if (printerType === "cmyk") {
      return {
        black: round2(raw.k),
        cyan: round2(raw.c),
        magenta: round2(raw.m),
        yellow: round2(raw.y),
      };
    }
    // color-black printer: combined color cartridge load + black cartridge load
    return {
      black: round2(raw.k),
      color: round2((raw.c + raw.m + raw.y) / 3),
    };
  }

  // ── Aggregate (document averages) ──────────────────────────────────────────
  private aggregate(pages: PageAnalysis[], settings: AnalysisSettings): OverallCoverage {
    if (pages.length === 0) {
      return { channels: this.emptyChannels(settings), coveragePercent: 0 };
    }
    const sums: Record<keyof ChannelCoverage, number> = {
      black: 0, cyan: 0, magenta: 0, yellow: 0, color: 0,
    };
    let coverageSum = 0;
    for (const p of pages) {
      (Object.keys(sums) as (keyof ChannelCoverage)[]).forEach((k) => {
        const v = p.channels[k];
        if (typeof v === "number") sums[k] += v;
      });
      coverageSum += p.coveragePercent;
    }
    const n = pages.length;
    const out: ChannelCoverage = { black: round2(sums.black / n) };
    if (settings.colorMode === "color") {
      if (settings.printerType === "cmyk") {
        out.cyan = round2(sums.cyan / n);
        out.magenta = round2(sums.magenta / n);
        out.yellow = round2(sums.yellow / n);
      } else {
        out.color = round2(sums.color / n);
      }
    }
    return { channels: out, coveragePercent: round2(coverageSum / n) };
  }

  private emptyChannels(settings: AnalysisSettings): ChannelCoverage {
    if (settings.colorMode === "bw") return { black: 0 };
    if (settings.printerType === "cmyk") return { black: 0, cyan: 0, magenta: 0, yellow: 0 };
    return { black: 0, color: 0 };
  }
}

function round2(v: number): number { return Math.round(v * 100) / 100; }
