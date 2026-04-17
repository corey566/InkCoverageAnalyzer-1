# Ink Coverage Estimator - Sterling Carter Technology Distributors (SCTD)

## Overview

A professional web application for print shops and mass printing centers that analyzes ink coverage in documents and calculates cost per page. Supports PDF, EPS, and image formats with CMYK or Color+Black modes.

**Company Contact:**
- Address: 15A Lady Musgrave Road, St. Andrew, Kingston 5, JAMAICA
- Email: info@sctdjm.com
- Phone: (876) 968-6637

## System Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: TanStack Query v5
- **Routing**: Wouter
- **Build**: Vite
- **PDF Export**: jsPDF + jspdf-autotable

### Backend
- **Runtime**: Node.js + Express.js + TypeScript
- **File Processing**: Multer (50MB limit)
- **Storage**: In-memory (MemStorage)

## Analysis Engine — Page-Area Coverage Model

The engine computes **mutually-exclusive page-area coverage**, not additive CMYK ink load.
Every displayed percentage is a share of the full page; totals never exceed 100%.

### Pipeline
1. Render each page (PDF/EPS/image) at the user-selected DPI, composited onto a
   white canvas matching the user's chosen page size (A4, Letter, Legal, Tabloid,
   Custom, or auto-detected from PDF metadata).
2. Walk every pixel and assign it to exactly **one** of the four CMYK buckets:
   `black`, `cyan`, `magenta`, `yellow`. Each pixel is converted RGB→CMYK and
   bucketed by its dominant channel (ties favor K). Near-white pixels are
   counted as `blankArea` (uncovered paper).
3. Aggregate counts as page-area %. Total coverage = Black + Cyan + Magenta + Yellow;
   blank = 100 − total. No bucket and no sum ever exceeds 100%.

In B&W mode every covered pixel is bucketed as `black`; the result is the total
inked area as a single percentage of the page.

Optional Ghostscript `inkcov` data is captured separately as `inkLoad` for
advanced display only — never mixed into the primary percentages.

## Settings (required before analysis)
- **Page size**: A4 / Letter / Legal / Tabloid / Custom / Auto (PDF auto-detect, server-side enforced)
- **Resolution**: 72 / 150 / 300 / 600 DPI
- **Mode**: Color or Black & White

## Cost Estimator
Formula: `effective_yield = rated_yield × (reference_coverage % ÷ actual_coverage %)`
Inputs: copies, cartridge yield/price (black + optional color), reference coverage (default 5%), waste %.
Outputs: base cost/page, adjusted cost/page, ±8% range, total cost for all copies, cartridge breakdown.

## Document Preview
- PDFs: embedded iframe viewer with scroll/navigation
- Images (PNG, JPG, TIFF): displayed with zoom controls (50–200%)
- Served via `/api/documents/:id/file`

### PDF Export
Click "Export PDF Report" after analysis to download a formatted PDF with:
- SCTD logo + contact info in header
- Overall coverage summary table
- Page-by-page breakdown table
- Cost estimation results (if calculated)
- SCTD footer on each page

## Pages

- `/` — Home (estimator)
- `/print-management` — Printer brands, ink waste, best practices
- `/cost-analysis` — Platform comparison (SCTD vs competitors)
- `/enterprise` — Enterprise solutions description
- `/documentation` — Step-by-step usage guide + FAQ
- `/training` — Training modules (beginner to advanced)
- `/contact` — Contact support form + contact info
- `/privacy-policy` — Privacy policy (no data retained)
- `/terms-of-service` — Terms of service

## API Endpoints

- `POST /api/documents/upload` — Upload file (PDF, PNG, JPG, TIFF, EPS)
- `GET /api/documents/:id/page-info` — Detect PDF page dimensions for prefill
- `POST /api/documents/:id/analyze` — Start analysis (body: `AnalysisSettings`)
- `GET /api/documents/:id/file` — Serve file for preview
- `GET /api/analyses/:id` — Poll for results
- `POST /api/estimate` — Calculate cost per page (page-area coverage model)

## Key Files

- `server/analysis-engine.ts` — Core CMYK analysis logic
- `server/routes.ts` — API routes + cost calculation + file serving
- `shared/schema.ts` — Types and database schema
- `client/src/components/file-upload.tsx` — Upload UI + document preview
- `client/src/components/document-preview.tsx` — PDF/image preview component
- `client/src/components/analysis-results.tsx` — Results + cost estimator + PDF export
- `client/src/components/header.tsx` — Header with SCTD logo
- `client/src/components/footer.tsx` — Footer with real contact info
- `client/src/pages/home.tsx` — Main page
- `attached_assets/image_1774596436652.png` — SCTD full logo
- `attached_assets/image_1774596489615.png` — SCTD icon logo

## Deployment

- Port 5000 (Express serves frontend + API)
- Max file size: 50MB
- Node.js 20, PostgreSQL 16 available
