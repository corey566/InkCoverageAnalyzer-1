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

## Analysis Engine

### Primary Method (PDFs): Ghostscript `inkcov` device
Reads CMYK ink coverage **directly from the PDF's color specifications**.
Output format: `C  M  Y  K  CMYK OK` (values 0.0–1.0 per page)

### Fallback Method (images + PDF fallback): ImageMagick RGB formula
Renders each page to RGB with a white background, then calculates CMYK.

## Features

### Document Preview
- PDFs: embedded iframe viewer with scroll/navigation
- Images (PNG, JPG, TIFF): displayed with zoom controls (50–200%)
- Served via `/api/documents/:id/file` endpoint

### Analysis Modes
1. **CMYK Mode** — Separate Cyan, Magenta, Yellow, Black channels
2. **Color + Black Mode** — Combined color cartridge (CMY average) + black

### Cost Estimator
Formula: `effective_yield = rated_yield × (5 / actual_coverage)`
Displays base cost, adjusted cost (with waste factor), variation range (±8%), per-cartridge breakdown.

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
- `POST /api/documents/:id/analyze` — Start analysis
- `GET /api/documents/:id/file` — Serve file for preview
- `GET /api/analyses/:id` — Poll for results
- `POST /api/estimate` — Calculate cost per page

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
