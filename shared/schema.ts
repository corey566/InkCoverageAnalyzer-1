import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
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
  status: text("status").notNull().default("pending"),
  mode: text("mode").notNull().default("cmyk"),
  totalPages: integer("total_pages"),
  overallCoverage: jsonb("overall_coverage").$type<OverallCoverage>(),
  pageBreakdown: jsonb("page_breakdown").$type<PageAnalysis[]>(),
  settings: jsonb("settings").$type<AnalysisSettings>(),
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

// ── Page-area coverage model (mutually exclusive buckets) ─────────────────────

export type ColorBucketKey = "black" | "cyan" | "magenta" | "yellow";

export type ColorBuckets = Record<ColorBucketKey, number>;

export const EMPTY_BUCKETS: ColorBuckets = {
  black: 0, cyan: 0, magenta: 0, yellow: 0,
};

export const COLOR_BUCKET_KEYS: ColorBucketKey[] = ["black", "cyan", "magenta", "yellow"];

/** Optional internal CMYK ink-load (additive, can exceed 100%). Not for primary display. */
export interface CMYKInkLoad {
  cyan: number;
  magenta: number;
  yellow: number;
  black: number;
}

export interface PageAnalysis {
  page: number;
  totalCoverage: number; // % of page area covered (0–100)
  blankArea: number;     // 100 - totalCoverage
  colors: ColorBuckets;  // each is % of page area; sum == totalCoverage
  inkLoad?: CMYKInkLoad; // advanced — additive CMYK channel load
}

export interface OverallCoverage {
  totalCoverage: number;
  blankArea: number;
  colors: ColorBuckets;
  inkLoad?: CMYKInkLoad;
}

// ── Settings ──────────────────────────────────────────────────────────────────

export type PageSizePreset =
  | "A4" | "Letter" | "Legal" | "Tabloid" | "Custom" | "Auto";

export interface PageSize {
  preset: PageSizePreset;
  widthMM: number;
  heightMM: number;
}

export type ColorMode = "color" | "bw";

export interface AnalysisSettings {
  pageSize: PageSize;
  resolutionDPI: 72 | 150 | 300 | 600;
  colorMode: ColorMode;
}

export const PAGE_SIZE_PRESETS: Record<Exclude<PageSizePreset, "Custom" | "Auto">, { widthMM: number; heightMM: number }> = {
  A4:      { widthMM: 210, heightMM: 297 },
  Letter:  { widthMM: 215.9, heightMM: 279.4 },
  Legal:   { widthMM: 215.9, heightMM: 355.6 },
  Tabloid: { widthMM: 279.4, heightMM: 431.8 },
};

// ── Analysis result envelope ──────────────────────────────────────────────────

export interface AnalysisResult {
  totalPages: number;
  settings: AnalysisSettings;
  overallCoverage: OverallCoverage;
  pageBreakdown: PageAnalysis[];
}

// ── Cost estimation ──────────────────────────────────────────────────────────

export interface CostEstimate {
  mode: ColorMode; // "color" or "bw"
  // Page-area coverage figures
  totalCoverage: number;          // % page covered
  blackCoverage: number;          // % page covered by black bucket (also full coverage in bw mode)
  colorCoverage: number;          // totalCoverage - blackCoverage (color non-black)
  copies: number;                 // number of copies
  wastePercent: number;
  // Cartridge inputs
  blackYield?: number;
  blackPrice?: number;
  colorYield?: number;
  colorPrice?: number;
  // Standard reference coverage (default 5)
  referenceCoverage?: number;
}

export interface CostResult {
  mode: ColorMode;
  baseCostPerPage: number;
  adjustedCostPerPage: number;
  rangeMin: number;
  rangeMax: number;
  totalCost: number;             // for all copies (adjusted)
  copies: number;
  breakdown: {
    black?: number;
    color?: number;
  };
}
