import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id).notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  totalPages: integer("total_pages"),
  overallCoverage: jsonb("overall_coverage").$type<{
    cyan: number;
    magenta: number;
    yellow: number;
    black: number;
  }>(),
  pageBreakdown: jsonb("page_breakdown").$type<Array<{
    page: number;
    cyan: number;
    magenta: number;
    yellow: number;
    black: number;
    total: number;
  }>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

// Additional types for comprehensive ink analysis
export interface CMYKCoverage {
  cyan: number;
  magenta: number;
  yellow: number;
  black: number;
}

export interface PageAnalysis {
  page: number;
  cyan: number;
  magenta: number;
  yellow: number;
  black: number;
  total: number;
}

export interface AnalysisResult {
  totalPages: number;
  overallCoverage: CMYKCoverage;
  pageBreakdown: PageAnalysis[];
}

export interface PixelAnalysisResult {
  totalPixels: number;
  pixelCounts: {
    total: number;
    cyan: number;
    magenta: number;
    yellow: number;
    black: number;
    textPixels: number;
    imagePixels: number;
  };
  percentages: CMYKCoverage;
  textVsImage: {
    textPixels: number;
    imagePixels: number;
    textPercentage: number;
    imagePercentage: number;
  };
}

export interface DetailedPageAnalysis {
  totalPixels: number;
  cmykCoverage: CMYKCoverage;
  pixelCounts: {
    total: number;
    cyan: number;
    magenta: number;
    yellow: number;
    black: number;
    textPixels: number;
    imagePixels: number;
  };
  textAnalysis: CMYKCoverage;
  imageAnalysis: CMYKCoverage;
  breakdown: {
    textPercentage: number;
    imagePercentage: number;
  };
}
