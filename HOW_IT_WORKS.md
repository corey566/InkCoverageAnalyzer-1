# Sterling Carter Ink/Toner Coverage Analyzer — How It Works

A complete, line-by-line explanation of how the application analyzes a document and produces ink/toner coverage numbers, what technology runs at each step, and the exact formulas behind every percentage you see on the screen.

---

## 1. What the application is

This app estimates how much ink (or toner) a printer would use to print a given document. It does **not** physically print anything. Instead, it renders the document into pixels at the page size and resolution the user picks, then measures how much of each ink cartridge would be deposited if those pixels were sent to a real printer.

The result is shown two ways:

1. **Per-cartridge coverage** — how loaded each individual cartridge is (Black, Cyan, Magenta, Yellow, or a single combined Color cartridge).
2. **Total page coverage** — what percentage of the physical page actually has any ink on it. The rest is blank paper.

Both numbers are always between 0% and 100%.

---

## 2. The 4-step user flow

The user is walked through four configuration screens before any analysis happens. The order matters because each step changes what the engine measures.

### Step 1 — Printer type
- **CMYK printer (4 separate cartridges)** — the result will show four independent values: Black (K), Cyan (C), Magenta (M), Yellow (Y). This matches a typical office laser or production CMYK device.
- **Color + Black inkjet (2 cartridges)** — the result will combine C, M, Y into one "Color" cartridge value, plus a separate Black value. This matches a typical home/SOHO inkjet that has only two physical cartridges.

### Step 2 — Print mode
- **Color** — the engine reports every cartridge that the printer in Step 1 would use.
- **Black & White** — the engine reports only the Black cartridge. Any colored area in the source document is treated as something the printer would render with black ink only, so its darkness is folded into the Black number (see Section 6.1 for the exact formula).

### Step 3 — Page size + DPI
The user picks the physical page size (Letter, A4, A3, custom mm) and a print resolution in dots per inch (e.g. 150, 300, 600 DPI). For PDFs, the page size is auto-detected from the document and pre-filled, but the user can override it.

These two numbers determine how many pixels the engine renders the page into. The bigger the page or the higher the DPI, the more pixels — and therefore the more accurate the measurement, at the cost of analysis time.

### Step 4 — File upload
The user uploads a PDF, EPS, or image file. The server stores it on disk and returns a document ID; analysis is triggered with the settings from Steps 1–3.

---

## 3. The technology stack

### Frontend
- **React** (Vite, TypeScript) for the UI.
- **wouter** for routing.
- **TanStack Query (v5)** for fetching analysis results.
- **shadcn/ui + Tailwind CSS** for styled components.
- **react-hook-form + Zod** for form validation in the 4 steps.

### Backend
- **Node.js + Express** for the HTTP API.
- **Multer** for file uploads (saved into `uploads/`).
- **In-memory storage** (`MemStorage`) for documents and analysis records.
- **Drizzle ORM + Zod schemas** in `shared/schema.ts` so frontend and backend share a single source of truth for types.

### External binaries (called via `child_process.exec`)
These are the workhorses of the analysis. The Node code only orchestrates them.

| Tool | What it does for us |
| --- | --- |
| **`pdfinfo`** (Poppler) | Reads PDF metadata — page count and physical page size — used to pre-fill Step 3. |
| **`gs`** (Ghostscript) with the `inkcov` device | Computes true per-channel CMYK ink coverage from a PDF's native colorspace. This is the most accurate path. |
| **`convert`** (ImageMagick 7) | Rasterizes any source (PDF, EPS, image) into an sRGB PNG at the exact pixel size the user requested. Also generates the page previews shown in the UI. |
| **`identify`** (ImageMagick 7) | Reads back the dimensions of the rendered PNG so the engine knows how many pixels it is about to scan. |

The orchestration code is `server/analysis-engine.ts`. The HTTP routes live in `server/routes.ts`.

---

## 4. The end-to-end pipeline

```
upload  →  detect PDF info  →  for each page:
                                   (a) try Ghostscript inkcov  (PDF only)
                                   (b) always run a pixel pass on a rendered PNG
                                   (c) merge results
                              →  shape into the cartridge set the printer needs
                              →  aggregate all pages into a document average
                              →  store + return JSON
```

Each box below corresponds to a real method in `analyzeDocument(...)`.

### 4.1 Detecting the page count and size
For PDF/EPS we shell out to `pdfinfo` and parse two regexes:

```
Pages: <N>
Page size: <W> x <H> pts
```

We convert from PostScript points to millimeters with the standard factor `25.4 / 72`:

```
widthMM  = wPts × 25.4 / 72
heightMM = hPts × 25.4 / 72
```

For non-PDF/EPS files (PNG, JPG, TIFF…) the page count is forced to 1 and the page size is whatever the user picked in Step 3.

### 4.2 Bounding the render size
Before rendering, the engine computes the target pixel dimensions:

```
widthPx  = round( widthMM  / 25.4 × DPI )
heightPx = round( heightMM / 25.4 × DPI )
```

To keep memory and CPU bounded, a hard cap of **4,000,000 pixels** is enforced. If the requested size exceeds that cap, both dimensions are scaled down by

```
scale = sqrt( 4_000_000 / (widthPx × heightPx) )
```

so the aspect ratio is preserved and the total never exceeds 4 MP.

### 4.3 Rendering the page to a PNG
ImageMagick's `convert` is invoked once per page. The exact command (assembled in `renderPage`) is:

```
convert
  -density <min(DPI, 300)>      # the rasterization DPI for vector input
  -background white
  -alpha remove -alpha off      # flatten transparency onto white paper
  "<file>[<pageIndex>]"         # for PDF/EPS, select the page
  -colorspace sRGB              # normalize to a known colorspace
  -resize <W>x<H>               # match the user's chosen page-pixel size
  -gravity center
  -extent <W>x<H>               # pad to exact dimensions so we know totalPixels
  "<outPath>.png"
```

The rendered PNG is written to a temporary file under `temp/`. It is deleted right after the pixel scan so the disk does not fill up.

### 4.4 The Ghostscript `inkcov` fast path (PDF only)
For native PDFs, Ghostscript can read the PDF's own colorspace and report exact per-channel ink fractions per page. The command is:

```
gs -q -dBATCH -dNOPAUSE -sDEVICE=inkcov -sOutputFile=/dev/null "<file>"
```

`inkcov` prints one line per page like:

```
0.04210  0.00321  0.00540  0.43162 CMYK OK
```

Each number is the fraction (0–1) of the page area that would be covered by that ink if printed on a CMYK device. The engine multiplies by 100 to get percentages:

```
C% = parts[0] × 100
M% = parts[1] × 100
Y% = parts[2] × 100
K% = parts[3] × 100
```

These are the **per-cartridge** loads for that page. They are independent values: a green pixel contributes to both Cyan and Yellow at the same time. Any single channel is 0–100; their **sum can exceed 100%** because cartridges are independent (think solid red ink = 100% M + 100% Y).

If `inkcov` fails for any reason (e.g. the file is not a PDF, or Ghostscript can't parse it), the pipeline silently falls back to the pixel pass for the per-channel numbers.

### 4.5 The pixel pass — always run
Even when `inkcov` succeeds, the engine **also** does a pixel pass on the rendered PNG, because `inkcov` only gives the four channel fractions — it does **not** tell us how much of the page is blank paper vs. has any ink at all. We need the latter to compute the "Total Page Coverage" number.

The pixel pass works on the raw RGB byte stream of the PNG:

```
convert "<png>" -depth 8 RGB:-
```

This streams `width × height × 3` bytes — for every pixel, R, G, B as 0–255.

For each pixel:

1. Compute `max = max(R,G,B)` and `min = min(R,G,B)`.
2. **Blank-paper test.** If `min ≥ 245` AND `max − min ≤ 8`, the pixel is treated as paper (basically white, neutral). It is skipped — no cartridge contribution, and it does not count toward the inked area.
3. Otherwise the pixel is "inked." Increment `inkedPixels`.
4. Convert RGB → CMYK in [0…1] using the standard formulas:

```
K = 1 − max / 255
denom = 1 − K
C = (1 − R/255 − K) / denom
M = (1 − G/255 − K) / denom
Y = (1 − B/255 − K) / denom
```

(If `denom ≈ 0` the pixel is pure black and C=M=Y are forced to 0.)

5. Accumulate `sumC, sumM, sumY, sumK`.

After scanning all `totalPixels` pixels, the per-channel and coverage numbers are:

```
C%               = sumC / totalPixels × 100
M%               = sumM / totalPixels × 100
Y%               = sumY / totalPixels × 100
K%               = sumK / totalPixels × 100
coveragePercent  = inkedPixels / totalPixels × 100      ← always 0–100
```

The denominator for the channels is `totalPixels`, not `inkedPixels`, so the channel values represent ink load over the **whole page**, the same convention `inkcov` uses.

### 4.6 Combining the two passes
Per page, the engine builds a `RawCMYK` record:

```
if Ghostscript inkcov succeeded for this page:
    raw = { C, M, Y, K from inkcov }  +  { coveragePercent from pixel pass }
else:
    raw = pixel pass results          (C, M, Y, K, coveragePercent)
```

So the **per-channel numbers** are as accurate as Ghostscript can make them, while the **page-area coverage** is always derived from the rendered pixels.

### 4.7 Shaping into the printer's actual cartridge set
`shapeChannels(raw, settings)` turns the raw CMYK numbers into the values that match the printer the user picked in Steps 1 and 2.

#### 4.7.1 B&W mode (Step 2 = B&W)
Only the Black cartridge is used. To make sure colored areas in the source still register (a red logo printed on a B&W printer is rendered with black ink), we take the **maximum** of the K channel and the average of C, M, Y:

```
blackEquivalent = max( K,  (C + M + Y) / 3 )
result = { black: blackEquivalent }
```

This guarantees that pure-color regions (where K ≈ 0 but CMY are large) are not silently lost.

#### 4.7.2 CMYK printer in Color mode
The four channels are reported individually:

```
result = { black: K, cyan: C, magenta: M, yellow: Y }
```

#### 4.7.3 Color+Black inkjet in Color mode
The C/M/Y values are folded into a single "Color" cartridge using their average — the same way a tri-color cartridge depletes evenly across its three chambers:

```
result = { black: K, color: (C + M + Y) / 3 }
```

### 4.8 Document-level aggregation
After every page is processed, `aggregate(...)` produces the document averages by taking the **arithmetic mean across pages** for every value. With `n = number of pages`:

```
averageBlack            = (Σ page.black)            / n
averageCyan             = (Σ page.cyan)             / n     (CMYK color only)
averageMagenta          = (Σ page.magenta)          / n     (CMYK color only)
averageYellow           = (Σ page.yellow)           / n     (CMYK color only)
averageColor            = (Σ page.color)            / n     (color+black inkjet only)
averageCoveragePercent  = (Σ page.coveragePercent)  / n
```

All values are rounded to 2 decimal places (`round2 = round(x × 100) / 100`).

---

## 5. Two different things that are both percentages

This is the most important conceptual point in the whole app:

| What you see on the screen | What it represents | Range | Used for |
| --- | --- | --- | --- |
| **Per-cartridge value** (Black, Cyan, Magenta, Yellow, Color) | The independent ink load on **that one cartridge** as a fraction of the whole page area. | 0–100% per channel | Per-page cost estimation per cartridge. |
| **Total Page Coverage** | The fraction of the physical page that has **any ink at all** on it. | 0–100%, always | Telling the user how much of the page is actually printed vs. blank paper. |

Cartridges are **independent**, so for a CMYK printer the four cartridge values can sum to more than 100 — for example, a solid green region on the page is roughly 100% Cyan + 100% Yellow, which is the correct physical behavior of a printer. The Total Page Coverage number, on the other hand, only counts each pixel once, so it is bounded above by 100%.

---

## 6. Worked example

Take a 2-page PDF where page 1 is a half-page color logo and page 2 has only a small black footer.

After the engine processes the file you might see:

```json
{
  "totalPages": 2,
  "overallCoverage": {
    "channels": { "black": 1.14, "cyan": 0, "magenta": 0.10, "yellow": 0.13 },
    "coveragePercent": 2.51
  },
  "pageBreakdown": [
    { "page": 1, "channels": { "black": 2.13, "cyan": 0, "magenta": 0.19, "yellow": 0.25 }, "coveragePercent": 4.78 },
    { "page": 2, "channels": { "black": 0.15, "cyan": 0, "magenta": 0,    "yellow": 0    }, "coveragePercent": 0.23 }
  ]
}
```

Reading it:

- Page 1 covers 4.78% of the physical page with ink. The black cartridge would be loaded at 2.13% on that page; magenta at 0.19%; yellow at 0.25%; cyan unused.
- Page 2 is almost blank (0.23% of the page is inked) and only the black cartridge is touched (0.15%).
- Document averages are the per-page values divided by 2.

---

## 7. The HTTP API

Three endpoints drive the UI. They live in `server/routes.ts`.

| Route | Purpose |
| --- | --- |
| `POST /api/documents/upload` | Accepts a multipart file, saves it under `uploads/`, returns the document record (with `pdfInfo` for prefill). |
| `POST /api/documents/:id/analyze` | Body = `AnalysisSettings` from Steps 1–3. Runs the full pipeline and stores the `AnalysisResult` keyed by document id. |
| `GET  /api/analyses/:id` | Returns the stored `AnalysisResult` for the given document. The frontend polls this with TanStack Query. |
| `GET  /api/documents/:id/preview?page=N` | Renders one page of the PDF to PNG via ImageMagick and streams it back, used by the in-app preview component. |

All payloads are validated against Zod schemas defined in `shared/schema.ts`, so an invalid `printerType`, `colorMode`, page size, or DPI is rejected before the engine runs.

---

## 8. Why these choices

- **Ghostscript inkcov first, pixel pass second.** `inkcov` reads the PDF's true colorspace including spot colors and ICC profiles, so for a vector PDF it gives the same per-channel numbers a real RIP would. The pixel pass is needed for non-PDF inputs and to compute "Total Page Coverage," which `inkcov` alone cannot give.
- **Render at the user's chosen DPI.** Coverage numbers are slightly resolution-dependent because anti-aliased edges are partially inked. Letting the user pick the DPI matches the physical output device and keeps results reproducible.
- **4 MP rendering cap.** A 600 DPI A3 page is roughly 70 megapixels — large enough to lock up the server. 4 MP is plenty for accurate area measurement (≈ 0.1% precision) while keeping memory under ~12 MB per page.
- **Whitepaper threshold (`min ≥ 245`, `max − min ≤ 8`).** This treats the brightest ~4% of neutral pixels as paper. Without it, JPEG noise and scanner haze would make every page look ~100% inked.
- **Average across pages, not weighted by area.** Every page is one "print job" from a cost standpoint, so an unweighted mean is what a printer cost estimator wants. (If we weighted by physical page area we'd double-count when mixing Letter and A4 pages.)
- **Per-cartridge values are kept independent.** Real cartridges deplete independently; a printer cost model needs that, so the per-channel values are never normalized to sum to 100.

---

## 9. Files at a glance

| File | Role |
| --- | --- |
| `shared/schema.ts` | All shared types and Zod validators: `AnalysisSettings`, `ChannelCoverage`, `PageAnalysis`, `OverallCoverage`, `AnalysisResult`. |
| `server/analysis-engine.ts` | Everything in Section 4: `pdfinfo`, `inkcov`, `convert`, the pixel scan, channel shaping, aggregation. |
| `server/routes.ts` | The four HTTP endpoints in Section 7. |
| `server/storage.ts` | In-memory store (`MemStorage`) with the `IStorage` interface. |
| `client/src/pages/home.tsx` | The 4-step wizard host. |
| `client/src/components/file-upload.tsx` | Step 4 upload UI. |
| `client/src/components/analysis-results.tsx` | The results screen — cartridge cards, total coverage card, per-page table, CSV/PDF export. |
| `client/src/components/document-preview.tsx` | The PDF page preview that calls `/api/documents/:id/preview`. |

---

## 10. Glossary

- **Coverage (per channel)** — fraction of the page area that one specific ink cartridge would be deposited on. Independent of the other cartridges.
- **Total Page Coverage** — fraction of the page area that has any ink from any cartridge. Capped at 100% by definition.
- **DPI** — dots per inch; rasterization resolution. Higher = more accurate but slower.
- **CMYK** — Cyan, Magenta, Yellow, Key (black). The four-cartridge color model.
- **inkcov** — a Ghostscript output device that reports per-channel CMYK coverage for a PDF.
- **Cartridge** — the physical ink/toner container in the printer. A "Color+Black" inkjet has one tri-color cartridge plus a black cartridge; a CMYK printer has four separate cartridges.
