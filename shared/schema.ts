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
  mode: text("mode").notNull().default("color"),
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

// ── Printer types & print modes ───────────────────────────────────────────────

/** Two cartridge configurations the user can analyze for. */
export type PrinterType =
  | "cmyk"          // 4 separate cartridges: Cyan, Magenta, Yellow, Black
  | "color-black";  // 2 cartridges: combined Color (CMY) + Black

/** What the printout will actually look like. */
export type ColorMode = "color" | "bw";

// ── Per-channel ink coverage (each 0–100 %, channels are independent) ────────

/**
 * Each channel value is the percentage of "full ink" that channel would lay
 * down across the whole page area. Channels are INDEPENDENT measurements
 * (they are not mutually exclusive — a pixel that uses cyan + yellow
 * contributes to both). Each individual channel is in 0–100.
 */
export interface ChannelCoverage {
  black: number;             // K cartridge load (always present)
  cyan?: number;             // CMYK printers only
  magenta?: number;          // CMYK printers only
  yellow?: number;           // CMYK printers only
  color?: number;            // color-black printers only — combined CMY load
}

export interface PageAnalysis {
  page: number;
  channels: ChannelCoverage;
}

export interface OverallCoverage {
  channels: ChannelCoverage;
}

// ── Settings ──────────────────────────────────────────────────────────────────

export type PageSizePreset =
  | "A4" | "Letter" | "Legal" | "Tabloid" | "Custom" | "Auto";

export interface PageSize {
  preset: PageSizePreset;
  widthMM: number;
  heightMM: number;
}

export interface AnalysisSettings {
  printerType: PrinterType;
  colorMode: ColorMode;
  pageSize: PageSize;
  resolutionDPI: 72 | 150 | 300 | 600;
}

export const PAGE_SIZE_PRESETS: Record<Exclude<PageSizePreset, "Custom" | "Auto">, { widthMM: number; heightMM: number }> = {
  A4:      { widthMM: 210,    heightMM: 297 },
  Letter:  { widthMM: 215.9,  heightMM: 279.4 },
  Legal:   { widthMM: 215.9,  heightMM: 355.6 },
  Tabloid: { widthMM: 279.4,  heightMM: 431.8 },
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
  printerType: PrinterType;
  mode: ColorMode;
  copies: number;
  wastePercent: number;
  referenceCoverage?: number; // default 5
  // Per-channel coverage % (same shape as ChannelCoverage)
  channels: ChannelCoverage;
  // Cartridge inputs — use the ones relevant to printerType/mode
  blackYield?: number;
  blackPrice?: number;
  // CMYK printer
  cyanYield?: number;   cyanPrice?: number;
  magentaYield?: number; magentaPrice?: number;
  yellowYield?: number;  yellowPrice?: number;
  // Color-black printer
  colorYield?: number;   colorPrice?: number;
}

export interface CostResult {
  printerType: PrinterType;
  mode: ColorMode;
  baseCostPerPage: number;
  adjustedCostPerPage: number;
  rangeMin: number;
  rangeMax: number;
  totalCost: number; // for all copies (adjusted)
  copies: number;
  breakdown: {
    black?: number;
    cyan?: number;
    magenta?: number;
    yellow?: number;
    color?: number;
  };
}
