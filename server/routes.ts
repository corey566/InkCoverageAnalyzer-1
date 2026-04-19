import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  PAGE_SIZE_PRESETS,
  type AnalysisSettings,
  type CostEstimate,
  type CostResult,
  type PageSize,
  type PageSizePreset,
} from "@shared/schema";
import { DocumentAnalysisEngine } from "./analysis-engine";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const analysisEngine = new DocumentAnalysisEngine();

const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const mimeToExt: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/postscript": ".eps",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/tiff": ".tiff",
  "image/gif": ".gif",
};

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = mimeToExt[file.mimetype] || path.extname(file.originalname) || "";
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (mimeToExt[file.mimetype]) cb(null, true);
    else cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
});

function resolvePageSize(input: any): PageSize {
  const preset: PageSizePreset = input?.preset || "A4";
  if (preset === "Custom" || preset === "Auto") {
    return {
      preset,
      widthMM: clampNumber(input?.widthMM, 10, 2000, 210),
      heightMM: clampNumber(input?.heightMM, 10, 2000, 297),
    };
  }
  const p = PAGE_SIZE_PRESETS[preset as keyof typeof PAGE_SIZE_PRESETS];
  if (!p) return { preset: "A4", widthMM: 210, heightMM: 297 };
  return { preset, widthMM: p.widthMM, heightMM: p.heightMM };
}

function clampNumber(v: any, min: number, max: number, fallback: number): number {
  const n = typeof v === "number" ? v : parseFloat(v);
  if (!isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function resolveSettings(input: any): AnalysisSettings {
  const dpiRaw = parseInt(input?.resolutionDPI, 10);
  const allowed = [72, 150, 300, 600];
  const resolutionDPI = (allowed.includes(dpiRaw) ? dpiRaw : 150) as 72 | 150 | 300 | 600;
  const colorMode = input?.colorMode === "bw" ? "bw" : "color";
  const printerType = input?.printerType === "color-black" ? "color-black" : "cmyk";
  return { printerType, colorMode, pageSize: resolvePageSize(input?.pageSize), resolutionDPI };
}

function cartridgeCost(coverage: number | undefined, yieldPages?: number, price?: number, ref = 5): number {
  if (!yieldPages || !price || !coverage || coverage <= 0) return 0;
  const effectiveYield = yieldPages * (ref / Math.max(coverage, 0.1));
  return price / effectiveYield;
}

function calculateCost(estimate: CostEstimate): CostResult {
  const reference = estimate.referenceCoverage && estimate.referenceCoverage > 0 ? estimate.referenceCoverage : 5;
  const wasteFactor = 1 + (estimate.wastePercent / 100);
  const breakdown: CostResult["breakdown"] = {};
  let totalBase = 0;

  const ch = estimate.channels || {};

  // Black cartridge is always used (in either mode, either printer type).
  const blackCost = cartridgeCost(ch.black, estimate.blackYield, estimate.blackPrice, reference);
  if (blackCost > 0) { breakdown.black = round4(blackCost); totalBase += blackCost; }

  if (estimate.mode === "color") {
    if (estimate.printerType === "cmyk") {
      const cCost = cartridgeCost(ch.cyan,    estimate.cyanYield,    estimate.cyanPrice,    reference);
      const mCost = cartridgeCost(ch.magenta, estimate.magentaYield, estimate.magentaPrice, reference);
      const yCost = cartridgeCost(ch.yellow,  estimate.yellowYield,  estimate.yellowPrice,  reference);
      if (cCost > 0) { breakdown.cyan = round4(cCost); totalBase += cCost; }
      if (mCost > 0) { breakdown.magenta = round4(mCost); totalBase += mCost; }
      if (yCost > 0) { breakdown.yellow = round4(yCost); totalBase += yCost; }
    } else {
      const colorCost = cartridgeCost(ch.color, estimate.colorYield, estimate.colorPrice, reference);
      if (colorCost > 0) { breakdown.color = round4(colorCost); totalBase += colorCost; }
    }
  }

  const adjusted = totalBase * wasteFactor;
  const variation = 0.08;
  const copies = Math.max(1, Math.floor(estimate.copies || 1));

  return {
    printerType: estimate.printerType,
    mode: estimate.mode,
    baseCostPerPage: round4(totalBase),
    adjustedCostPerPage: round4(adjusted),
    rangeMin: round4(adjusted * (1 - variation)),
    rangeMax: round4(adjusted * (1 + variation)),
    totalCost: round4(adjusted * copies),
    copies,
    breakdown,
  };
}

function round4(v: number): number { return Math.round(v * 10000) / 10000; }

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload document
  app.post("/api/documents/upload", upload.single("file"), async (req: MulterRequest, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });
      const document = await storage.createDocument({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
      });
      res.json(document);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Detect page dimensions for prefill (PDF only)
  app.get("/api/documents/:id/page-info", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const document = await storage.getDocument(id);
      if (!document) return res.status(404).json({ message: "Document not found" });
      if (document.mimeType !== "application/pdf") {
        return res.json({ widthMM: null, heightMM: null, pageCount: 1, isPDF: false });
      }
      const filePath = path.join(uploadDir, document.filename);
      const info = await analysisEngine.getPDFInfo(filePath);
      res.json({ ...info, isPDF: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to read page info" });
    }
  });

  // Start analysis
  app.post("/api/documents/:id/analyze", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id, 10);
      const document = await storage.getDocument(documentId);
      if (!document) return res.status(404).json({ message: "Document not found" });

      const settings = resolveSettings(req.body || {});

      // If user picked "Auto" page size and we have a PDF/EPS, derive dims server-side.
      if (settings.pageSize.preset === "Auto" &&
          (document.mimeType === "application/pdf" || document.mimeType === "application/postscript")) {
        try {
          const filePath = path.join(uploadDir, document.filename);
          const info = await analysisEngine.getPDFInfo(filePath);
          settings.pageSize = { preset: "Auto", widthMM: info.widthMM, heightMM: info.heightMM };
        } catch {
          // Fall through with whatever dims the client sent.
        }
      }

      // Always create a fresh analysis (settings can change between runs)
      const analysis = await storage.createAnalysis({
        documentId,
        status: "processing",
        mode: settings.colorMode,
        totalPages: null,
        overallCoverage: null,
        pageBreakdown: null,
        settings,
        errorMessage: null,
      });

      setImmediate(async () => {
        try {
          const filePath = path.join(uploadDir, document.filename);
          console.log(`Analyzing ${document.originalName} mode=${settings.colorMode} dpi=${settings.resolutionDPI} page=${settings.pageSize.preset}`);
          const results = await analysisEngine.analyzeDocument(filePath, document.mimeType, settings);
          await storage.updateAnalysis(analysis.id, {
            status: "completed",
            totalPages: results.totalPages,
            overallCoverage: results.overallCoverage,
            pageBreakdown: results.pageBreakdown,
            settings: results.settings,
            completedAt: new Date(),
          });
          console.log(`Analysis complete for ${document.originalName}: ${JSON.stringify(results.overallCoverage.channels)}`);
        } catch (error) {
          console.error("Analysis error:", error);
          await storage.updateAnalysis(analysis.id, {
            status: "failed",
            errorMessage: error instanceof Error ? error.message : "Analysis failed",
            completedAt: new Date(),
          });
        }
      });

      res.json(analysis);
    } catch (error) {
      console.error("Analysis start error:", error);
      res.status(500).json({ message: "Failed to start analysis" });
    }
  });

  app.get("/api/analyses/:id", async (req, res) => {
    try {
      const analysis = await storage.getAnalysis(parseInt(req.params.id, 10));
      if (!analysis) return res.status(404).json({ message: "Analysis not found" });
      res.json(analysis);
    } catch {
      res.status(500).json({ message: "Failed to get analysis" });
    }
  });

  app.post("/api/estimate", async (req, res) => {
    try {
      const estimate: CostEstimate = req.body;
      if (!estimate || !estimate.channels || typeof estimate.channels.black !== "number") {
        return res.status(400).json({ message: "Missing required channel coverage" });
      }
      const result = calculateCost(estimate);
      res.json(result);
    } catch (error) {
      console.error("Estimate error:", error);
      res.status(500).json({ message: "Cost estimation failed" });
    }
  });

  app.get("/api/documents", async (_req, res) => {
    try { res.json(await storage.getDocuments()); }
    catch { res.status(500).json({ message: "Failed to get documents" }); }
  });

  // PDF preview: render a single page to a PNG so all browsers can show it
  app.get("/api/documents/:id/preview", async (req, res) => {
    try {
      const document = await storage.getDocument(parseInt(req.params.id, 10));
      if (!document) return res.status(404).json({ message: "Document not found" });
      const pageRaw = parseInt((req.query.page as string) || "1", 10);
      const page = isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
      const previewDir = path.join(process.cwd(), "previews");
      await fs.mkdir(previewDir, { recursive: true });
      const outPath = path.join(previewDir, `${document.filename}_p${page}.png`);

      try {
        await fs.access(outPath);
      } catch {
        const filePath = path.join(uploadDir, document.filename);
        if (document.mimeType === "application/pdf" || document.mimeType === "application/postscript") {
          const { exec } = await import("child_process");
          const { promisify } = await import("util");
          const execAsync = promisify(exec);
          await execAsync(
            `convert -density 150 -background white -alpha remove -alpha off "${filePath}[${page - 1}]" -resize 1200x1600 "${outPath}"`,
            { maxBuffer: 64 * 1024 * 1024 },
          );
        } else if (document.mimeType.startsWith("image/")) {
          // Just copy/normalize the image to PNG
          const { exec } = await import("child_process");
          const { promisify } = await import("util");
          const execAsync = promisify(exec);
          await execAsync(`convert "${filePath}" -resize 1200x1600 "${outPath}"`);
        } else {
          return res.status(415).json({ message: "Preview not supported for this file type" });
        }
      }

      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.sendFile(outPath);
    } catch (err) {
      console.error("Preview error:", err);
      res.status(500).json({ message: "Failed to render preview" });
    }
  });

  app.get("/api/documents/:id/file", async (req, res) => {
    try {
      const document = await storage.getDocument(parseInt(req.params.id, 10));
      if (!document) return res.status(404).json({ message: "Document not found" });
      const filePath = path.join(uploadDir, document.filename);
      res.setHeader("Content-Type", document.mimeType);
      res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(document.originalName)}"`);
      res.sendFile(filePath);
    } catch {
      res.status(500).json({ message: "Failed to serve file" });
    }
  });

  return createServer(app);
}
