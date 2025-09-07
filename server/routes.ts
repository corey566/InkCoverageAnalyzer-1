import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDocumentSchema, insertAnalysisSchema } from "@shared/schema";
import { DocumentAnalysisEngine } from "./analysis-engine";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { createReadStream } from "fs";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Initialize the analysis engine
const analysisEngine = new DocumentAnalysisEngine();

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common document formats
    const allowedMimes = [
      'application/pdf',
      'application/postscript', // EPS
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  }
});


export async function registerRoutes(app: Express): Promise<Server> {
  // Upload document endpoint
  app.post("/api/documents/upload", upload.single('file'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const document = await storage.createDocument({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size
      });

      res.json(document);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Start analysis endpoint
  app.post("/api/documents/:id/analyze", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Check if analysis already exists
      let analysis = await storage.getAnalysisByDocumentId(documentId);
      if (analysis) {
        return res.json(analysis);
      }

      // Create new analysis
      analysis = await storage.createAnalysis({
        documentId,
        status: "processing",
        totalPages: null,
        overallCoverage: null,
        pageBreakdown: null,
        errorMessage: null
      });

      // Start analysis in background
      setImmediate(async () => {
        try {
          const filePath = path.join(uploadDir, document.filename);
          console.log(`Starting real analysis for ${document.originalName} (${document.mimeType})`);
          const results = await analysisEngine.analyzeDocument(filePath, document.mimeType);
          
          console.log(`Analysis completed for ${document.originalName}:`, results);
          await storage.updateAnalysis(analysis.id, {
            status: "completed",
            totalPages: results.totalPages,
            overallCoverage: results.overallCoverage,
            pageBreakdown: results.pageBreakdown,
            completedAt: new Date()
          });
        } catch (error) {
          console.error("Analysis error:", error);
          await storage.updateAnalysis(analysis.id, {
            status: "failed",
            errorMessage: error instanceof Error ? error.message : "Analysis failed",
            completedAt: new Date()
          });
        }
      });

      res.json(analysis);
    } catch (error) {
      console.error("Analysis start error:", error);
      res.status(500).json({ message: "Failed to start analysis" });
    }
  });

  // Get analysis status/results
  app.get("/api/analyses/:id", async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const analysis = await storage.getAnalysis(analysisId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({ message: "Failed to get analysis" });
    }
  });

  // Get document analysis
  app.get("/api/documents/:id/analysis", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const analysis = await storage.getAnalysisByDocumentId(documentId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Get document analysis error:", error);
      res.status(500).json({ message: "Failed to get analysis" });
    }
  });

  // Download report endpoints (PDF, Excel, Image)
  app.get("/api/analyses/:id/download/:format", async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const format = req.params.format;
      const analysis = await storage.getAnalysis(analysisId);
      
      if (!analysis || analysis.status !== "completed") {
        return res.status(404).json({ message: "Analysis not found or not completed" });
      }

      // Mock report generation - in production, generate actual reports
      const reportContent = JSON.stringify(analysis, null, 2);
      const filename = `ink-coverage-report-${analysisId}.${format === 'excel' ? 'xlsx' : format}`;
      
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 
                                   format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 
                                   'image/png');
      
      // For now, return JSON data - in production, generate proper reports
      res.send(reportContent);
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ message: "Download failed" });
    }
  });

  // Get all documents
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Get documents error:", error);
      res.status(500).json({ message: "Failed to get documents" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
