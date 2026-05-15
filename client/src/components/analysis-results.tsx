import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import type {
  Analysis,
  AnalysisSettings,
  ChannelCoverage,
  CostEstimate,
  CostResult,
  PageAnalysis,
  PrinterType,
  ColorMode,
} from "@shared/schema";
import logoPath from "@assets/image_1774596436652.png";

interface AnalysisResultsProps {
  analysisId: number | null;
  settings: AnalysisSettings | null;
}

type ChannelKey = "black" | "cyan" | "magenta" | "yellow" | "color";

const CHANNEL_META: Record<
  ChannelKey,
  { label: string; cssBar: string; cssDot: string; cssBg: string }
> = {
  black: {
    label: "Black",
    cssBar: "bg-gray-800",
    cssDot: "#1f2937",
    cssBg: "bg-slate-100",
  },
  cyan: {
    label: "Cyan",
    cssBar: "bg-cyan-500",
    cssDot: "#06b6d4",
    cssBg: "bg-cyan-50",
  },
  magenta: {
    label: "Magenta",
    cssBar: "bg-green-500",
    cssDot: "#16a34a",
    cssBg: "bg-green-50",
  },
  yellow: {
    label: "Yellow",
    cssBar: "bg-yellow-400",
    cssDot: "#eab308",
    cssBg: "bg-yellow-50",
  },
  color: {
    label: "Color (CMY)",
    cssBar: "bg-indigo-500",
    cssDot: "#6366f1",
    cssBg: "bg-indigo-50",
  },
};

function activeKeys(printerType: PrinterType, mode: ColorMode): ChannelKey[] {
  if (mode === "bw") return ["black"];
  if (printerType === "cmyk") return ["black", "cyan", "magenta", "yellow"];
  return ["black", "color"];
}

/**
 * Page-area coverage — % of the page that has any ink at all (0–100, capped).
 * This is the "total coverage" the user sees and is provided by the engine.
 */

function CoverageCard({
  label,
  value,
  dotColor,
  barClass,
}: {
  label: string;
  value: number;
  dotColor: string;
  barClass: string;
}) {
  return (
    <div className="rounded-3xl p-4 bg-white/90 border-2 border-white shadow-lg shadow-green-100/40 hover:-translate-y-1 transition-all duration-200">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm text-slate-800 inline-flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ background: dotColor }}
          />
          {label}
        </span>
        <span className="text-lg font-bold text-slate-900">
          {value.toFixed(2)}%
        </span>
      </div>
      <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barClass}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function AnalysisResults({
  analysisId,
  settings,
}: AnalysisResultsProps) {
  const { toast } = useToast();
  const [showAllPages, setShowAllPages] = useState(false);
  const [costResult, setCostResult] = useState<CostResult | null>(null);

  const [copies, setCopies] = useState("100");
  const [referenceCoverage, setReferenceCoverage] = useState("5");
  const [wastePercent, setWastePercent] = useState("10");

  // Per-cartridge inputs
  const [blackYield, setBlackYield] = useState("2000");
  const [blackPrice, setBlackPrice] = useState("12");
  // CMYK
  const [cyanYield, setCyanYield] = useState("1500");
  const [cyanPrice, setCyanPrice] = useState("18");
  const [magentaYield, setMagentaYield] = useState("1500");
  const [magentaPrice, setMagentaPrice] = useState("18");
  const [yellowYield, setYellowYield] = useState("1500");
  const [yellowPrice, setYellowPrice] = useState("18");
  // Color cartridge (color-black printer)
  const [colorYield, setColorYield] = useState("1500");
  const [colorPrice, setColorPrice] = useState("25");

  const { data: analysis, isLoading } = useQuery<Analysis>({
    queryKey: [`/api/analyses/${analysisId}`],
    enabled: !!analysisId,
    refetchInterval: (query) => {
      const a = query.state.data as Analysis;
      return a?.status === "processing" ? 2000 : false;
    },
  });

  const usedSettings = (analysis?.settings ||
    settings) as AnalysisSettings | null;
  const printerType = usedSettings?.printerType || "cmyk";
  const colorMode = usedSettings?.colorMode || "color";
  const keys = activeKeys(printerType, colorMode);

  const estimateMutation = useMutation({
    mutationFn: async (estimate: CostEstimate) => {
      const response = await apiRequest("POST", "/api/estimate", estimate);
      return response.json() as Promise<CostResult>;
    },
    onSuccess: (result) => setCostResult(result),
    onError: () =>
      toast({
        title: "Estimation failed",
        description: "Please check your inputs.",
        variant: "destructive",
      }),
  });

  const handleCalculateCost = () => {
    if (!analysis?.overallCoverage) return;
    const ch = analysis.overallCoverage.channels;
    const estimate: CostEstimate = {
      printerType,
      mode: colorMode,
      copies: parseInt(copies, 10) || 1,
      wastePercent: parseFloat(wastePercent) || 0,
      referenceCoverage: parseFloat(referenceCoverage) || 5,
      channels: ch,
      blackYield: parseFloat(blackYield),
      blackPrice: parseFloat(blackPrice),
    };
    if (colorMode === "color") {
      if (printerType === "cmyk") {
        estimate.cyanYield = parseFloat(cyanYield);
        estimate.cyanPrice = parseFloat(cyanPrice);
        estimate.magentaYield = parseFloat(magentaYield);
        estimate.magentaPrice = parseFloat(magentaPrice);
        estimate.yellowYield = parseFloat(yellowYield);
        estimate.yellowPrice = parseFloat(yellowPrice);
      } else {
        estimate.colorYield = parseFloat(colorYield);
        estimate.colorPrice = parseFloat(colorPrice);
      }
    }
    estimateMutation.mutate(estimate);
  };

  const handleExportCSV = () => {
    if (!analysis?.overallCoverage || !analysis.pageBreakdown) return;
    const ch = analysis.overallCoverage.channels;
    const rows: string[][] = [];
    rows.push(["Sterling Carter — Coverage Report"]);
    rows.push([`Generated: ${new Date().toLocaleString()}`]);
    rows.push([
      `Printer type: ${printerType === "cmyk" ? "CMYK Cartridge" : "Color & Black Cartridge"}`,
    ]);
    rows.push([
      `Print mode: ${colorMode === "bw" ? "Black & White" : "Color"}`,
    ]);
    if (usedSettings) {
      rows.push([
        `Page size: ${usedSettings.pageSize.preset} (${usedSettings.pageSize.widthMM}×${usedSettings.pageSize.heightMM} mm)`,
      ]);
      rows.push([`Resolution: ${usedSettings.resolutionDPI} DPI`]);
    }
    rows.push([`Total pages analyzed: ${analysis.totalPages}`]);
    rows.push([]);
    rows.push(["Document Average Cartridge Coverage"]);
    keys.forEach((k) =>
      rows.push([CHANNEL_META[k].label, `${(ch[k] ?? 0).toFixed(2)}%`]),
    );
    rows.push([
      "Total Page Coverage",
      `${analysis.overallCoverage.coveragePercent.toFixed(2)}%`,
    ]);
    rows.push([]);
    rows.push(["Page-by-page story 📄"]);
    rows.push([
      "Page",
      ...keys.map((k) => `${CHANNEL_META[k].label} %`),
      "Total %",
    ]);
    analysis.pageBreakdown.forEach((p) => {
      rows.push([
        String(p.page),
        ...keys.map((k) => (p.channels[k] ?? 0).toFixed(2)),
        p.coveragePercent.toFixed(2),
      ]);
    });
    rows.push([
      "Document Average",
      ...keys.map((k) => (ch[k] ?? 0).toFixed(2)),
      analysis.overallCoverage.coveragePercent.toFixed(2),
    ]);
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "coverage-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "CSV exported",
      description: "Open in Excel or any spreadsheet app.",
    });
  };

  const handleExportPDF = async () => {
    if (!analysis?.overallCoverage || !analysis.pageBreakdown) return;
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 18;

    const img = new Image();
    img.src = logoPath;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
    doc.setFillColor(10, 35, 16);
    doc.rect(0, 0, pageW, 42, "F");
    try {
      const canvas = window.document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        const logoH = 14;
        const logoW = (img.naturalWidth / img.naturalHeight) * logoH;
        doc.addImage(dataUrl, "PNG", margin, 10, logoW, logoH);
      }
    } catch {}
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("Sterling Carter Technology Distributors", pageW - margin, 13, {
      align: "right",
    });
    doc.setFontSize(7.5);
    doc.text(
      "15A Lady Musgrave Road, St. Andrew, Kingston 5, JAMAICA",
      pageW - margin,
      19,
      { align: "right" },
    );
    doc.text("info@sctdjm.com  |  (876) 968-6637", pageW - margin, 24, {
      align: "right",
    });
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("INK / TONER COVERAGE ANALYSIS REPORT", margin, 35);

    let y = 52;
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Printer: ${printerType === "cmyk" ? "CMYK Cartridge" : "Color & Black"}`,
      margin,
      y,
    );
    doc.text(
      `Mode: ${colorMode === "bw" ? "Black & White" : "Color"}`,
      pageW / 2,
      y,
    );
    if (usedSettings) {
      doc.text(`${usedSettings.resolutionDPI} DPI`, pageW - margin, y, {
        align: "right",
      });
      y += 5;
      doc.text(
        `Page: ${usedSettings.pageSize.preset} (${usedSettings.pageSize.widthMM}×${usedSettings.pageSize.heightMM} mm)`,
        margin,
        y,
      );
    }
    y += 5;
    doc.text(`Pages analyzed: ${analysis.totalPages}`, margin, y);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - margin, y, {
      align: "right",
    });
    y += 10;

    const ch = analysis.overallCoverage.channels;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(10, 45, 20);
    doc.text("Ink usage snapshot 🎨", margin, y);
    y += 4;
    const summaryRows: string[][] = keys.map((k) => [
      CHANNEL_META[k].label,
      `${(ch[k] ?? 0).toFixed(2)}%`,
    ]);
    summaryRows.push([
      "Total Page Coverage",
      `${analysis.overallCoverage.coveragePercent.toFixed(2)}%`,
    ]);
    autoTable(doc, {
      startY: y,
      head: [["Cartridge", "Average Coverage"]],
      body: summaryRows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [10, 45, 20], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 250, 242] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(10, 45, 20);
    doc.text("Page-by-page story 📄", margin, y);
    y += 4;
    const head = [["Page", ...keys.map((k) => CHANNEL_META[k].label), "Total"]];
    const body = analysis.pageBreakdown.map((p) => [
      `Page ${p.page}`,
      ...keys.map((k) => `${(p.channels[k] ?? 0).toFixed(2)}%`),
      `${p.coveragePercent.toFixed(2)}%`,
    ]);
    body.push([
      "Document Average",
      ...keys.map((k) => `${(ch[k] ?? 0).toFixed(2)}%`),
      `${analysis.overallCoverage.coveragePercent.toFixed(2)}%`,
    ]);
    autoTable(doc, {
      startY: y,
      head,
      body,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [10, 45, 20], textColor: 255, fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 252, 249] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;

    if (costResult) {
      if (y > 220) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(10, 45, 20);
      doc.text("Cost Estimation", margin, y);
      y += 4;
      const costRows: string[][] = [
        ["Base cost / page", `$${costResult.baseCostPerPage.toFixed(4)}`],
        [
          `Adjusted (+${wastePercent}% waste)`,
          `$${costResult.adjustedCostPerPage.toFixed(4)}`,
        ],
        ["Range (min)", `$${costResult.rangeMin.toFixed(4)}`],
        ["Range (max)", `$${costResult.rangeMax.toFixed(4)}`],
        [
          `Total for ${costResult.copies} copies`,
          `$${costResult.totalCost.toFixed(2)}`,
        ],
      ];
      autoTable(doc, {
        startY: y,
        head: [["Description", "Amount"]],
        body: costRows,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [10, 45, 20], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 250, 242] },
      });
    }

    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, 285, pageW - margin, 285);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Sterling Carter Technology Distributors  |  info@sctdjm.com  |  (876) 968-6637",
        margin,
        289,
      );
      doc.text(`Page ${i} of ${totalPages}`, pageW - margin, 289, {
        align: "right",
      });
    }
    doc.save("coverage-report.pdf");
    toast({
      title: "Report exported",
      description: "Your PDF report has been downloaded.",
    });
  };

  if (!analysisId) return null;

  if (isLoading) {
    return (
      <section className="py-16 bg-transparent">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-3xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
          <div className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!analysis) return null;

  if (analysis.status === "processing") {
    return (
      <section className="py-16 bg-transparent">
        <div className="max-w-5xl mx-auto px-4">
          <div
            className="bg-white/90 rounded-[2rem] border-2 border-emerald-100 p-10 text-center"
            style={{
              boxShadow:
                "0 24px 80px rgba(22,163,74,0.14), 0 14px 40px rgba(14,165,233,0.10), 0 8px 24px rgba(15,23,42,0.06)",
            }}
          >
            <div
              className="w-14 h-14 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-5"
              style={{
                borderColor: "hsl(133, 55%, 40%)",
                borderTopColor: "transparent",
              }}
            />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Analyzing Your Document ✨
            </h3>
            <p className="text-slate-500">
              Checking ink coverage page by page. Bigger files may need a little
              more time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (analysis.status === "failed") {
    return (
      <section className="py-16 bg-transparent">
        <div className="max-w-5xl mx-auto px-4">
          <div
            className="bg-white rounded-2xl border border-red-200 p-8 text-center"
            style={{
              boxShadow:
                "0 24px 80px rgba(22,163,74,0.14), 0 14px 40px rgba(14,165,233,0.10), 0 8px 24px rgba(15,23,42,0.06)",
            }}
          >
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-800 mb-1">
              Analysis Failed
            </h3>
            <p className="text-slate-600">
              {analysis.errorMessage || "Please try again."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (
    analysis.status !== "completed" ||
    !analysis.overallCoverage ||
    !analysis.pageBreakdown
  )
    return null;

  const ch: ChannelCoverage = analysis.overallCoverage.channels;
  const pages = analysis.pageBreakdown as PageAnalysis[];
  const displayPages = showAllPages ? pages : pages.slice(0, 5);
  const printerLabel =
    printerType === "cmyk"
      ? "CMYK Cartridge Analysis"
      : "Color & Black Cartridge";
  const modeLabel = colorMode === "bw" ? "Black & White Print" : "Color Print";

  return (
    <section id="results" className="py-16 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 space-y-6 relative">
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-green-200/50 blur-2xl" />
        <div className="pointer-events-none absolute top-40 -left-10 h-36 w-36 rounded-full bg-cyan-200/50 blur-2xl" />
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-100 via-lime-100 to-cyan-100 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 border border-white shadow-sm mb-1">
              Results
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1">
              Cartridge Coverage Results ✅
            </h2>
            <p className="text-slate-600 text-sm">
              {analysis.totalPages} page{analysis.totalPages !== 1 ? "s" : ""}{" "}
              analyzed · {printerLabel} · {modeLabel}
              {usedSettings && (
                <>
                  {" "}
                  · {usedSettings.pageSize.preset} (
                  {usedSettings.pageSize.widthMM}×
                  {usedSettings.pageSize.heightMM} mm) ·{" "}
                  {usedSettings.resolutionDPI} DPI
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                borderColor: "#16a34a",
                color: "#15803d",
                background: "rgba(255,255,255,0.75)",
              }}
            >
              <FileSpreadsheet className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                borderColor: "#16a34a",
                color: "#15803d",
                background: "rgba(255,255,255,0.75)",
              }}
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Cartridge coverage summary */}
        <div
          className="bg-white/85 backdrop-blur rounded-[2rem] border-2 border-white p-5 md:p-6 relative overflow-hidden"
          style={{
            boxShadow:
              "0 24px 80px rgba(22,163,74,0.14), 0 14px 40px rgba(14,165,233,0.10), 0 8px 24px rgba(15,23,42,0.06)",
          }}
        >
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Ink usage snapshot 🎨
          </h3>
          <p className="text-sm text-slate-400 mb-5">
            Each value is the average ink load on that individual cartridge
            (0–100%). Cartridges are independent — an area printed in green uses
            both the Cyan and the Yellow cartridge, so cartridge values overlap.
            The total page coverage below is the share of the page that has any
            ink at all.
          </p>

          <div
            className={`grid grid-cols-1 gap-3 mb-4 ${
              keys.length === 1
                ? ""
                : keys.length === 2
                  ? "md:grid-cols-2"
                  : keys.length === 3
                    ? "md:grid-cols-3"
                    : "md:grid-cols-4"
            }`}
          >
            {keys.map((k) => (
              <CoverageCard
                key={k}
                label={CHANNEL_META[k].label}
                value={ch[k] ?? 0}
                dotColor={CHANNEL_META[k].cssDot}
                barClass={CHANNEL_META[k].cssBar}
              />
            ))}
          </div>

          {/* Total ink load */}
          <div
            className="rounded-3xl p-4 border-2 border-green-200"
            style={{
              background:
                "linear-gradient(135deg, #f0fdf4 0%, #ecfccb 48%, #ecfeff 100%)",
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-bold text-sm" style={{ color: "#166534" }}>
                  Total Page Coverage
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Percentage of the page that has any ink on it. The remaining{" "}
                  {(100 - analysis.overallCoverage.coveragePercent).toFixed(2)}%
                  is blank paper.
                </p>
              </div>
              <span className="text-2xl font-bold" style={{ color: "#166534" }}>
                {analysis.overallCoverage.coveragePercent.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-2.5 overflow-hidden border border-green-100">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(analysis.overallCoverage.coveragePercent, 100)}%`,
                  background:
                    "linear-gradient(135deg, #15803d 0%, #16a34a 45%, #22c55e 100%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Per-page table */}
        <div
          className="bg-white/85 backdrop-blur rounded-[2rem] border-2 border-white p-5 md:p-6 relative overflow-hidden"
          style={{
            boxShadow:
              "0 24px 80px rgba(22,163,74,0.14), 0 14px 40px rgba(14,165,233,0.10), 0 8px 24px rgba(15,23,42,0.06)",
          }}
        >
          <h3 className="text-base font-bold text-slate-900 mb-5">
            Page-by-page story 📄
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-xs uppercase">
                  <th className="text-left py-3 px-2 font-semibold">Page</th>
                  {keys.map((k) => (
                    <th
                      key={k}
                      className="text-right py-3 px-2 font-semibold"
                      style={{ color: CHANNEL_META[k].cssDot }}
                    >
                      {CHANNEL_META[k].label}
                    </th>
                  ))}
                  <th
                    className="text-right py-3 px-2 font-semibold"
                    style={{ color: "#15803d" }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayPages.map((p) => (
                  <tr
                    key={p.page}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-2.5 px-2 font-semibold text-slate-800">
                      Page {p.page}
                    </td>
                    {keys.map((k) => (
                      <td
                        key={k}
                        className="py-2.5 px-2 text-right text-slate-700"
                      >
                        {(p.channels[k] ?? 0) > 0.005
                          ? `${(p.channels[k] ?? 0).toFixed(2)}%`
                          : "—"}
                      </td>
                    ))}
                    <td
                      className="py-2.5 px-2 text-right font-bold"
                      style={{ color: "#15803d" }}
                    >
                      {p.coveragePercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-green-200 bg-gradient-to-r from-green-50 via-lime-50 to-cyan-50">
                  <td className="py-3 px-2 font-bold text-slate-900 text-sm">
                    Document Average
                  </td>
                  {keys.map((k) => (
                    <td
                      key={k}
                      className="py-3 px-2 text-right font-bold text-slate-800"
                    >
                      {(ch[k] ?? 0).toFixed(2)}%
                    </td>
                  ))}
                  <td
                    className="py-3 px-2 text-right font-bold"
                    style={{ color: "#166534" }}
                  >
                    {analysis.overallCoverage.coveragePercent.toFixed(2)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {pages.length > 5 && (
            <div className="text-center mt-5">
              <button
                onClick={() => setShowAllPages(!showAllPages)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full transition-colors"
                style={{ color: "#15803d" }}
              >
                {showAllPages ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Show all {pages.length}{" "}
                    pages
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Cost estimator */}
        <div
          className="bg-white/85 backdrop-blur rounded-[2rem] border-2 border-white p-5 md:p-6 relative overflow-hidden"
          style={{
            boxShadow:
              "0 24px 80px rgba(22,163,74,0.14), 0 14px 40px rgba(14,165,233,0.10), 0 8px 24px rgba(15,23,42,0.06)",
          }}
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="w-9 h-9 rounded-3xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #dcfce7 0%, #ecfccb 45%, #cffafe 100%)",
              }}
            >
              <Calculator className="w-5 h-5" style={{ color: "#15803d" }} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Cost Estimator 🧮
            </h3>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            {colorMode === "bw"
              ? "Black & white cost is based on the black cartridge coverage."
              : printerType === "cmyk"
                ? "Each CMYK cartridge is costed by its own coverage."
                : "Color cost combines the tri-color cartridge usage and the black cartridge."}{" "}
            Cartridge yield is rated at the standard reference coverage (default
            5%).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CartridgeInputs
              label="Black Cartridge"
              yieldVal={blackYield}
              setYieldVal={setBlackYield}
              priceVal={blackPrice}
              setPriceVal={setBlackPrice}
              accent="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200"
            />
            {colorMode === "color" && printerType === "color-black" && (
              <CartridgeInputs
                label="Color Cartridge"
                yieldVal={colorYield}
                setYieldVal={setColorYield}
                priceVal={colorPrice}
                setPriceVal={setColorPrice}
                accent="bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-100"
              />
            )}
            {colorMode === "color" && printerType === "cmyk" && (
              <>
                <CartridgeInputs
                  label="Cyan Cartridge"
                  yieldVal={cyanYield}
                  setYieldVal={setCyanYield}
                  priceVal={cyanPrice}
                  setPriceVal={setCyanPrice}
                  accent="bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-100"
                />
                <CartridgeInputs
                  label="Magenta Cartridge"
                  yieldVal={magentaYield}
                  setYieldVal={setMagentaYield}
                  priceVal={magentaPrice}
                  setPriceVal={setMagentaPrice}
                  accent="bg-gradient-to-br from-green-50 to-lime-50 border border-green-100"
                />
                <CartridgeInputs
                  label="Yellow Cartridge"
                  yieldVal={yellowYield}
                  setYieldVal={setYellowYield}
                  priceVal={yellowPrice}
                  setPriceVal={setYellowPrice}
                  accent="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100"
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-white/80 rounded-3xl border-2 border-sky-100 shadow-sm">
              <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">
                Number of Copies
              </Label>
              <Input
                value={copies}
                onChange={(e) => setCopies(e.target.value)}
                type="number"
                min="1"
                step="1"
                className="h-10 text-sm bg-white rounded-2xl border-2 border-sky-100 focus-visible:ring-green-200"
              />
            </div>
            <div className="p-4 bg-white/80 rounded-3xl border-2 border-sky-100 shadow-sm">
              <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">
                Reference Coverage (%)
              </Label>
              <Input
                value={referenceCoverage}
                onChange={(e) => setReferenceCoverage(e.target.value)}
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                className="h-10 text-sm bg-white rounded-2xl border-2 border-sky-100 focus-visible:ring-green-200"
              />
            </div>
            <div className="p-4 bg-white/80 rounded-3xl border-2 border-sky-100 shadow-sm">
              <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">
                Waste Factor (%)
              </Label>
              <Input
                value={wastePercent}
                onChange={(e) => setWastePercent(e.target.value)}
                type="number"
                min="0"
                max="100"
                step="1"
                className="h-10 text-sm bg-white rounded-2xl border-2 border-sky-100 focus-visible:ring-green-200"
              />
            </div>
          </div>

          <button
            onClick={handleCalculateCost}
            disabled={estimateMutation.isPending}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-full font-black text-white text-sm transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background:
                "linear-gradient(135deg, #15803d 0%, #16a34a 45%, #22c55e 100%)",
            }}
          >
            {estimateMutation.isPending ? (
              <>
                <div
                  className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                  style={{
                    borderColor: "white",
                    borderTopColor: "transparent",
                  }}
                />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" /> Calculate My Cost
              </>
            )}
          </button>

          {costResult && (
            <div className="mt-5 rounded-3xl overflow-hidden border-2 border-white shadow-xl shadow-green-100/50">
              <div
                className="px-5 py-3 font-bold text-sm text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #15803d 0%, #16a34a 45%, #22c55e 100%)",
                }}
              >
                Cost Results ✨
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-green-100">
                {[
                  {
                    label: "Base / page",
                    value: `$${costResult.baseCostPerPage.toFixed(4)}`,
                    sub: "Exact coverage",
                  },
                  {
                    label: `Adjusted / page (+${wastePercent}% waste)`,
                    value: `$${costResult.adjustedCostPerPage.toFixed(4)}`,
                    sub: "Recommended",
                  },
                  {
                    label: "Range / page",
                    value: `$${costResult.rangeMin.toFixed(4)} – $${costResult.rangeMax.toFixed(4)}`,
                    sub: "±8% variation",
                  },
                  {
                    label: `Total (${costResult.copies} copies)`,
                    value: `$${costResult.totalCost.toFixed(2)}`,
                    sub: "All copies, adjusted",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 bg-gradient-to-br from-green-50 via-lime-50 to-cyan-50"
                  >
                    <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: "#15803d" }}
                    >
                      {item.value}
                    </p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                ))}
              </div>
              {Object.keys(costResult.breakdown).length > 0 && (
                <div className="px-5 py-4 bg-white border-t border-green-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Cartridge Breakdown
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(
                      [
                        "black",
                        "cyan",
                        "magenta",
                        "yellow",
                        "color",
                      ] as ChannelKey[]
                    )
                      .filter(
                        (k) => (costResult.breakdown as any)[k] !== undefined,
                      )
                      .map((k) => (
                        <div
                          key={k}
                          className={`text-center p-3 ${CHANNEL_META[k].cssBg} rounded-3xl`}
                        >
                          <p className="text-xs text-slate-600 font-semibold mb-1">
                            {CHANNEL_META[k].label}
                          </p>
                          <p className="text-sm font-bold text-slate-900">
                            $
                            {(
                              (costResult.breakdown as any)[k] as number
                            ).toFixed(4)}
                            /page
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Formula: effective yield = rated yield × (reference coverage %
                  ÷ actual coverage %). Range shows ±8% variation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CartridgeInputs({
  label,
  yieldVal,
  setYieldVal,
  priceVal,
  setPriceVal,
  accent,
}: {
  label: string;
  yieldVal: string;
  setYieldVal: (v: string) => void;
  priceVal: string;
  setPriceVal: (v: string) => void;
  accent: string;
}) {
  return (
    <div className={`p-4 ${accent} rounded-3xl shadow-sm`}>
      <p className="font-bold mb-3 text-slate-800 text-sm">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-slate-500 mb-1 block">
            Yield (pages)
          </Label>
          <Input
            value={yieldVal}
            onChange={(e) => setYieldVal(e.target.value)}
            type="number"
            min="1"
            className="bg-white h-10 text-sm rounded-2xl border-2 border-sky-100 focus-visible:ring-green-200"
          />
        </div>
        <div>
          <Label className="text-xs text-slate-500 mb-1 block">
            Price (USD)
          </Label>
          <Input
            value={priceVal}
            onChange={(e) => setPriceVal(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            className="bg-white h-10 text-sm rounded-2xl border-2 border-sky-100 focus-visible:ring-green-200"
          />
        </div>
      </div>
    </div>
  );
}
