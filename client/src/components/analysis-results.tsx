import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calculator, AlertCircle, ChevronDown, ChevronUp, Download, FileSpreadsheet } from "lucide-react";
import type {
  Analysis,
  AnalysisSettings,
  CostEstimate,
  CostResult,
  ColorBuckets,
  ColorBucketKey,
  PageAnalysis,
} from "@shared/schema";
import logoPath from "@assets/image_1774596436652.png";

interface AnalysisResultsProps {
  analysisId: number | null;
  settings: AnalysisSettings | null;
}

const BUCKET_META: Record<ColorBucketKey, { label: string; cssBg: string; cssBar: string; cssText: string; cssDot: string }> = {
  black:   { label: "Black",   cssBg: "bg-gray-100",   cssBar: "bg-gray-800",  cssText: "text-gray-900", cssDot: "#1f2937" },
  cyan:    { label: "Cyan",    cssBg: "bg-cyan-50",    cssBar: "bg-cyan-500",  cssText: "text-cyan-900", cssDot: "#06b6d4" },
  magenta: { label: "Magenta", cssBg: "bg-pink-50",    cssBar: "bg-pink-500",  cssText: "text-pink-900", cssDot: "#ec4899" },
  yellow:  { label: "Yellow",  cssBg: "bg-yellow-50",  cssBar: "bg-yellow-400",cssText: "text-yellow-900",cssDot: "#eab308" },
};

const ALL_KEYS: ColorBucketKey[] = ["black", "cyan", "magenta", "yellow"];

function nonZero(buckets: ColorBuckets): Array<[ColorBucketKey, number]> {
  return ALL_KEYS.map((k) => [k, buckets[k]] as [ColorBucketKey, number]).filter(([, v]) => v > 0.005);
}

function CoverageBar({ label, value, dotColor, barClass, max = 100 }: {
  label: string; value: number; dotColor: string; barClass: string; max?: number;
}) {
  return (
    <div className="rounded-xl p-4 bg-white border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm text-gray-800 inline-flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: dotColor }} />
          {label}
        </span>
        <span className="text-lg font-bold text-gray-900">{value.toFixed(2)}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barClass}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
      </div>
    </div>
  );
}

export function AnalysisResults({ analysisId, settings }: AnalysisResultsProps) {
  const { toast } = useToast();
  const [showAllPages, setShowAllPages] = useState(false);
  const [costResult, setCostResult] = useState<CostResult | null>(null);

  const [copies, setCopies] = useState("100");
  const [blackYield, setBlackYield] = useState("2000");
  const [blackPrice, setBlackPrice] = useState("12");
  const [colorYield, setColorYield] = useState("1500");
  const [colorPrice, setColorPrice] = useState("25");
  const [referenceCoverage, setReferenceCoverage] = useState("5");
  const [wastePercent, setWastePercent] = useState("10");

  const { data: analysis, isLoading } = useQuery<Analysis>({
    queryKey: [`/api/analyses/${analysisId}`],
    enabled: !!analysisId,
    refetchInterval: (query) => {
      const a = query.state.data as Analysis;
      return a?.status === "processing" ? 2000 : false;
    },
  });

  const colorMode = (analysis?.settings?.colorMode || settings?.colorMode || "color") as "color" | "bw";
  const usedSettings = (analysis?.settings || settings) as AnalysisSettings | null;

  const estimateMutation = useMutation({
    mutationFn: async (estimate: CostEstimate) => {
      const response = await apiRequest("POST", "/api/estimate", estimate);
      return response.json() as Promise<CostResult>;
    },
    onSuccess: (result) => setCostResult(result),
    onError: () => toast({ title: "Estimation failed", description: "Please check your inputs.", variant: "destructive" }),
  });

  const handleCalculateCost = () => {
    if (!analysis?.overallCoverage) return;
    const cov = analysis.overallCoverage;
    const blackCoverage = cov.colors.black;
    const colorCoverage = Math.max(0, cov.totalCoverage - blackCoverage);
    const estimate: CostEstimate = {
      mode: colorMode,
      totalCoverage: cov.totalCoverage,
      blackCoverage,
      colorCoverage: colorMode === "bw" ? 0 : colorCoverage,
      copies: parseInt(copies, 10) || 1,
      wastePercent: parseFloat(wastePercent) || 0,
      blackYield: parseFloat(blackYield),
      blackPrice: parseFloat(blackPrice),
      referenceCoverage: parseFloat(referenceCoverage) || 5,
    };
    if (colorMode === "color") {
      estimate.colorYield = parseFloat(colorYield);
      estimate.colorPrice = parseFloat(colorPrice);
    }
    estimateMutation.mutate(estimate);
  };

  const handleExportCSV = () => {
    if (!analysis?.overallCoverage || !analysis.pageBreakdown) return;
    const cov = analysis.overallCoverage;
    const rows: string[][] = [];
    rows.push(["Sterling Carter — Page Coverage Report"]);
    rows.push([`Generated: ${new Date().toLocaleString()}`]);
    rows.push([`Mode: ${colorMode === "bw" ? "Black & White" : "Color"}`]);
    if (usedSettings) {
      rows.push([`Page size: ${usedSettings.pageSize.preset} (${usedSettings.pageSize.widthMM}×${usedSettings.pageSize.heightMM} mm)`]);
      rows.push([`Resolution: ${usedSettings.resolutionDPI} DPI`]);
    }
    rows.push([`Total pages analyzed: ${analysis.totalPages}`]);
    rows.push([]);
    rows.push(["Document Average"]);
    rows.push(["Total page coverage", `${cov.totalCoverage.toFixed(2)}%`]);
    rows.push(["Blank paper", `${cov.blankArea.toFixed(2)}%`]);
    nonZero(cov.colors).forEach(([k, v]) => rows.push([BUCKET_META[k].label, `${v.toFixed(2)}%`]));
    rows.push([]);
    rows.push(["Per-Page Breakdown"]);
    rows.push(["Page", "Coverage %", "Blank %", ...ALL_KEYS.map((k) => `${BUCKET_META[k].label} %`)]);
    analysis.pageBreakdown.forEach((p) => {
      rows.push([
        String(p.page),
        p.totalCoverage.toFixed(2),
        p.blankArea.toFixed(2),
        ...ALL_KEYS.map((k) => p.colors[k].toFixed(2)),
      ]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "page-coverage-report.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exported", description: "Open in Excel or any spreadsheet app." });
  };

  const handleExportPDF = async () => {
    if (!analysis?.overallCoverage || !analysis.pageBreakdown) return;
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 18;

    const img = new Image();
    img.src = logoPath;
    await new Promise<void>((resolve) => { img.onload = () => resolve(); img.onerror = () => resolve(); });
    doc.setFillColor(10, 35, 16); doc.rect(0, 0, pageW, 42, "F");
    try {
      const canvas = window.document.createElement("canvas");
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        const logoH = 14; const logoW = (img.naturalWidth / img.naturalHeight) * logoH;
        doc.addImage(dataUrl, "PNG", margin, 10, logoW, logoH);
      }
    } catch {}
    doc.setTextColor(255, 255, 255); doc.setFontSize(9);
    doc.text("Sterling Carter Technology Distributors", pageW - margin, 13, { align: "right" });
    doc.setFontSize(7.5);
    doc.text("15A Lady Musgrave Road, St. Andrew, Kingston 5, JAMAICA", pageW - margin, 19, { align: "right" });
    doc.text("info@sctdjm.com  |  (876) 968-6637", pageW - margin, 24, { align: "right" });
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("PAGE COVERAGE ANALYSIS REPORT", margin, 35);

    let y = 52;
    doc.setTextColor(30, 30, 30); doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text(`Mode: ${colorMode === "bw" ? "Black & White" : "Color"}`, margin, y);
    if (usedSettings) {
      doc.text(`Page: ${usedSettings.pageSize.preset} (${usedSettings.pageSize.widthMM}×${usedSettings.pageSize.heightMM} mm)`, pageW / 2, y, { align: "left" });
      doc.text(`Resolution: ${usedSettings.resolutionDPI} DPI`, pageW - margin, y, { align: "right" });
    }
    y += 6;
    doc.text(`Pages analyzed: ${analysis.totalPages}`, margin, y);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - margin, y, { align: "right" });
    y += 10;

    const cov = analysis.overallCoverage;
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(10, 45, 20);
    doc.text("Document Average — Page Coverage", margin, y); y += 4;
    const summaryRows: string[][] = [
      ["Total page coverage", `${cov.totalCoverage.toFixed(2)}%`],
      ["Blank paper", `${cov.blankArea.toFixed(2)}%`],
    ];
    nonZero(cov.colors).forEach(([k, v]) => summaryRows.push([BUCKET_META[k].label, `${v.toFixed(2)}%`]));
    autoTable(doc, {
      startY: y, head: [["Category", "% of Page"]], body: summaryRows,
      margin: { left: margin, right: margin }, styles: { fontSize: 9 },
      headStyles: { fillColor: [10, 45, 20], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 250, 242] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;

    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(10, 45, 20);
    doc.text("Per-Page Breakdown", margin, y); y += 4;
    const head = [["Page", "Coverage %", "Blank %", ...ALL_KEYS.map((k) => BUCKET_META[k].label)]];
    const body = analysis.pageBreakdown.map((p) => [
      `Page ${p.page}`,
      `${p.totalCoverage.toFixed(2)}%`,
      `${p.blankArea.toFixed(2)}%`,
      ...ALL_KEYS.map((k) => `${p.colors[k].toFixed(2)}%`),
    ]);
    autoTable(doc, {
      startY: y, head, body,
      margin: { left: margin, right: margin }, styles: { fontSize: 7 },
      headStyles: { fillColor: [10, 45, 20], textColor: 255, fontSize: 7 },
      alternateRowStyles: { fillColor: [248, 252, 249] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;

    if (costResult) {
      if (y > 220) { doc.addPage(); y = 20; }
      doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(10, 45, 20);
      doc.text("Cost Estimation", margin, y); y += 4;
      const costRows: string[][] = [
        ["Base cost / page", `$${costResult.baseCostPerPage.toFixed(4)}`],
        [`Adjusted (+${wastePercent}% waste)`, `$${costResult.adjustedCostPerPage.toFixed(4)}`],
        ["Range (min)", `$${costResult.rangeMin.toFixed(4)}`],
        ["Range (max)", `$${costResult.rangeMax.toFixed(4)}`],
        [`Total for ${costResult.copies} copies`, `$${costResult.totalCost.toFixed(2)}`],
      ];
      autoTable(doc, {
        startY: y, head: [["Description", "Amount"]], body: costRows,
        margin: { left: margin, right: margin }, styles: { fontSize: 9 },
        headStyles: { fillColor: [10, 45, 20], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 250, 242] },
      });
    }

    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, 285, pageW - margin, 285);
      doc.setFontSize(7); doc.setTextColor(150, 150, 150); doc.setFont("helvetica", "normal");
      doc.text("Sterling Carter Technology Distributors  |  info@sctdjm.com  |  (876) 968-6637", margin, 289);
      doc.text(`Page ${i} of ${totalPages}`, pageW - margin, 289, { align: "right" });
    }
    doc.save("page-coverage-report.pdf");
    toast({ title: "Report exported", description: "Your PDF report has been downloaded." });
  };

  if (!analysisId) return null;

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />)}
          </div>
          <div className="h-64 rounded-xl bg-gray-100 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!analysis) return null;

  if (analysis.status === "processing") {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
            <div className="w-14 h-14 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-5" style={{ borderColor: "hsl(133, 55%, 40%)", borderTopColor: "transparent" }} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Document</h3>
            <p className="text-gray-500">Calculating page-area coverage. Higher resolution and more pages take longer.</p>
          </div>
        </div>
      </section>
    );
  }

  if (analysis.status === "failed") {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-800 mb-1">Analysis Failed</h3>
            <p className="text-gray-600">{analysis.errorMessage || "Please try again."}</p>
          </div>
        </div>
      </section>
    );
  }

  if (analysis.status !== "completed" || !analysis.overallCoverage || !analysis.pageBreakdown) return null;

  const cov = analysis.overallCoverage;
  const pages = analysis.pageBreakdown as PageAnalysis[];
  const displayPages = showAllPages ? pages : pages.slice(0, 5);
  const visibleBuckets = colorMode === "bw"
    ? [["black", cov.colors.black] as [ColorBucketKey, number]]
    : nonZero(cov.colors);

  return (
    <section id="results" className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="section-label mb-1">Results</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Page Coverage Results</h2>
            <p className="text-gray-500 text-sm">
              {analysis.totalPages} page{analysis.totalPages !== 1 ? "s" : ""} analyzed
              {usedSettings && (
                <>
                  {" · "}{usedSettings.pageSize.preset} ({usedSettings.pageSize.widthMM}×{usedSettings.pageSize.heightMM} mm)
                  {" · "}{usedSettings.resolutionDPI} DPI · {colorMode === "bw" ? "B&W" : "Color"}
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 font-semibold text-sm transition-all"
              style={{ borderColor: "hsl(133, 48%, 36%)", color: "hsl(133, 48%, 36%)" }}
            >
              <FileSpreadsheet className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 font-semibold text-sm transition-all"
              style={{ borderColor: "hsl(133, 48%, 36%)", color: "hsl(133, 48%, 36%)" }}
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Overall coverage summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <h3 className="text-base font-bold text-gray-900 mb-1">Document Average — Page Coverage</h3>
          <p className="text-sm text-gray-400 mb-5">
            Every percentage shown is a share of the full page area. They are mutually exclusive and never exceed 100%.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl p-5" style={{ background: "hsl(133, 48%, 96%)" }}>
              <p className="text-xs uppercase tracking-wider font-bold mb-1" style={{ color: "hsl(133, 48%, 30%)" }}>Total Page Coverage</p>
              <p className="text-3xl font-bold" style={{ color: "hsl(133, 48%, 25%)" }}>{cov.totalCoverage.toFixed(2)}%</p>
            </div>
            <div className="rounded-xl p-5 bg-gray-50 border border-gray-100">
              <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-1">Blank Area</p>
              <p className="text-3xl font-bold text-gray-700">{cov.blankArea.toFixed(2)}%</p>
            </div>
          </div>

          {/* Stacked bar */}
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color Distribution (page area)</p>
            <div className="w-full h-5 rounded-full overflow-hidden flex bg-gray-100">
              {visibleBuckets.map(([k, v]) => (
                <div key={k} title={`${BUCKET_META[k].label}: ${v.toFixed(2)}%`} style={{ width: `${v}%`, background: BUCKET_META[k].cssDot }} />
              ))}
              {cov.blankArea > 0 && (
                <div style={{ width: `${cov.blankArea}%`, background: "#f3f4f6" }} title={`Blank: ${cov.blankArea.toFixed(2)}%`} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleBuckets.length > 0 ? (
              visibleBuckets.map(([k, v]) => (
                <CoverageBar
                  key={k}
                  label={BUCKET_META[k].label}
                  value={v}
                  dotColor={BUCKET_META[k].cssDot}
                  barClass={BUCKET_META[k].cssBar}
                  max={Math.max(cov.totalCoverage, 1)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">No printed content detected on the page.</p>
            )}
          </div>

          {cov.inkLoad && colorMode === "color" && (
            <details className="mt-6 text-sm">
              <summary className="cursor-pointer font-semibold text-gray-600 hover:text-gray-900">
                Advanced: CMYK ink load (additive — can exceed 100%)
              </summary>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-cyan-50 rounded">Cyan: <b>{cov.inkLoad.cyan.toFixed(2)}%</b></div>
                <div className="p-2 bg-pink-50 rounded">Magenta: <b>{cov.inkLoad.magenta.toFixed(2)}%</b></div>
                <div className="p-2 bg-yellow-50 rounded">Yellow: <b>{cov.inkLoad.yellow.toFixed(2)}%</b></div>
                <div className="p-2 bg-gray-100 rounded">Black: <b>{cov.inkLoad.black.toFixed(2)}%</b></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                These are per-channel ink load values from Ghostscript. They sum independently and are intended for technical reference only.
              </p>
            </details>
          )}
        </div>

        {/* Per-page table */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <h3 className="text-base font-bold text-gray-900 mb-5">Per-Page Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase">
                  <th className="text-left py-3 px-2 font-semibold">Page</th>
                  <th className="text-right py-3 px-2 font-semibold">Coverage</th>
                  <th className="text-right py-3 px-2 font-semibold">Blank</th>
                  {colorMode === "color"
                    ? ALL_KEYS.map((k) => (
                        <th key={k} className="text-right py-3 px-2 font-semibold" style={{ color: BUCKET_META[k].cssDot }}>
                          {BUCKET_META[k].label}
                        </th>
                      ))
                    : <th className="text-right py-3 px-2 font-semibold text-gray-700">Black</th>
                  }
                </tr>
              </thead>
              <tbody>
                {displayPages.map((p) => (
                  <tr key={p.page} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-2 font-semibold text-gray-800">Page {p.page}</td>
                    <td className="py-2.5 px-2 text-right font-bold text-gray-900">{p.totalCoverage.toFixed(2)}%</td>
                    <td className="py-2.5 px-2 text-right text-gray-500">{p.blankArea.toFixed(2)}%</td>
                    {colorMode === "color"
                      ? ALL_KEYS.map((k) => (
                          <td key={k} className="py-2.5 px-2 text-right text-gray-700">
                            {p.colors[k] > 0.005 ? `${p.colors[k].toFixed(2)}%` : "—"}
                          </td>
                        ))
                      : <td className="py-2.5 px-2 text-right text-gray-700">{p.colors.black.toFixed(2)}%</td>
                    }
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages.length > 5 && (
            <div className="text-center mt-5">
              <button
                onClick={() => setShowAllPages(!showAllPages)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full transition-colors"
                style={{ color: "hsl(133, 48%, 36%)" }}
              >
                {showAllPages ? <><ChevronUp className="w-4 h-4" /> Show less</> : <><ChevronDown className="w-4 h-4" /> Show all {pages.length} pages</>}
              </button>
            </div>
          )}
        </div>

        {/* Cost estimator */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(133, 48%, 94%)" }}>
              <Calculator className="w-5 h-5" style={{ color: "hsl(133, 48%, 36%)" }} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Cost Estimator</h3>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            {colorMode === "bw"
              ? "Black & white cost is calculated from the black coverage % of the page."
              : "Color cost is split between black coverage and the remaining color page-area coverage."}
            {" "}Cartridge yield is rated at the standard reference coverage (default 5%).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="font-bold mb-3 text-gray-800 text-sm">Black Cartridge</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Yield (pages)</Label>
                  <Input value={blackYield} onChange={(e) => setBlackYield(e.target.value)} type="number" min="1" className="bg-white h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Price (USD)</Label>
                  <Input value={blackPrice} onChange={(e) => setBlackPrice(e.target.value)} type="number" min="0" step="0.01" className="bg-white h-9 text-sm" />
                </div>
              </div>
            </div>
            {colorMode === "color" && (
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="font-bold mb-3 text-green-800 text-sm">Color Cartridge</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Yield (pages)</Label>
                    <Input value={colorYield} onChange={(e) => setColorYield(e.target.value)} type="number" min="1" className="bg-white h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Price (USD)</Label>
                    <Input value={colorPrice} onChange={(e) => setColorPrice(e.target.value)} type="number" min="0" step="0.01" className="bg-white h-9 text-sm" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Number of Copies</Label>
              <Input value={copies} onChange={(e) => setCopies(e.target.value)} type="number" min="1" step="1" className="h-9 text-sm bg-white" />
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Reference Coverage (%)</Label>
              <Input value={referenceCoverage} onChange={(e) => setReferenceCoverage(e.target.value)} type="number" min="0.1" max="100" step="0.1" className="h-9 text-sm bg-white" />
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Waste Factor (%)</Label>
              <Input value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} type="number" min="0" max="100" step="1" className="h-9 text-sm bg-white" />
            </div>
          </div>

          <button
            onClick={handleCalculateCost}
            disabled={estimateMutation.isPending}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-white text-sm transition-all disabled:opacity-50"
            style={{ background: "hsl(133, 55%, 40%)" }}
          >
            {estimateMutation.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }} />
                Calculating...
              </>
            ) : (
              <><Calculator className="w-4 h-4" /> Calculate Cost</>
            )}
          </button>

          {costResult && (
            <div className="mt-5 rounded-xl overflow-hidden border border-green-200">
              <div className="px-5 py-3 font-bold text-sm text-white" style={{ background: "hsl(133, 55%, 40%)" }}>Cost Results</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-green-100">
                {[
                  { label: "Base / page", value: `$${costResult.baseCostPerPage.toFixed(4)}`, sub: "Exact coverage" },
                  { label: `Adjusted / page (+${wastePercent}% waste)`, value: `$${costResult.adjustedCostPerPage.toFixed(4)}`, sub: "Recommended" },
                  { label: "Range / page", value: `$${costResult.rangeMin.toFixed(4)} – $${costResult.rangeMax.toFixed(4)}`, sub: "±8% variation" },
                  { label: `Total (${costResult.copies} copies)`, value: `$${costResult.totalCost.toFixed(2)}`, sub: "All copies, adjusted" },
                ].map((item) => (
                  <div key={item.label} className="p-4 bg-green-50">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="text-lg font-bold" style={{ color: "hsl(133, 48%, 30%)" }}>{item.value}</p>
                    <p className="text-xs text-gray-400">{item.sub}</p>
                  </div>
                ))}
              </div>
              {(costResult.breakdown.black !== undefined || costResult.breakdown.color !== undefined) && (
                <div className="px-5 py-4 bg-white border-t border-green-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Cartridge Breakdown</p>
                  <div className="grid grid-cols-2 gap-3">
                    {costResult.breakdown.black !== undefined && (
                      <div className="text-center p-3 bg-gray-100 rounded-xl">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Black</p>
                        <p className="text-sm font-bold text-gray-900">${costResult.breakdown.black.toFixed(4)}/page</p>
                      </div>
                    )}
                    {costResult.breakdown.color !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <p className="text-xs text-green-600 font-semibold mb-1">Color</p>
                        <p className="text-sm font-bold text-green-900">${costResult.breakdown.color.toFixed(4)}/page</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Formula: effective yield = rated yield × (reference coverage % ÷ actual coverage %). Range shows ±8% variation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
