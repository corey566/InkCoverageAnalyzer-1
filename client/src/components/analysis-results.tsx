import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calculator, AlertCircle, ChevronDown, ChevronUp, Download } from "lucide-react";
import type { Analysis, CostEstimate, CostResult } from "@shared/schema";
import logoPath from "@assets/image_1774596436652.png";

interface AnalysisResultsProps {
  analysisId: number | null;
  mode: "cmyk" | "color_black";
}

function CoverageBar({ label, value, color, bgColor, textColor }: {
  label: string; value: number; color: string; bgColor: string; textColor: string;
}) {
  return (
    <div className={`rounded-xl p-5 ${bgColor}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`font-semibold text-sm ${textColor}`}>{label}</span>
        <span className={`text-2xl font-bold ${textColor}`}>{value.toFixed(2)}%</span>
      </div>
      <div className="w-full bg-white bg-opacity-50 rounded-full h-3">
        <div className={`h-3 rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

export function AnalysisResults({ analysisId, mode }: AnalysisResultsProps) {
  const { toast } = useToast();
  const [showAllPages, setShowAllPages] = useState(false);
  const [costResult, setCostResult] = useState<CostResult | null>(null);

  const [cyanYield, setCyanYield] = useState("1000");
  const [cyanPrice, setCyanPrice] = useState("15");
  const [magentaYield, setMagentaYield] = useState("1000");
  const [magentaPrice, setMagentaPrice] = useState("15");
  const [yellowYield, setYellowYield] = useState("1000");
  const [yellowPrice, setYellowPrice] = useState("15");
  const [blackYield, setBlackYield] = useState("2000");
  const [blackPrice, setBlackPrice] = useState("12");

  const [colorYield, setColorYield] = useState("500");
  const [colorPrice, setColorPrice] = useState("25");
  const [cbBlackYield, setCbBlackYield] = useState("1000");
  const [cbBlackPrice, setCbBlackPrice] = useState("15");

  const [wastePercent, setWastePercent] = useState("10");

  const { data: analysis, isLoading } = useQuery<Analysis>({
    queryKey: [`/api/analyses/${analysisId}`],
    enabled: !!analysisId,
    refetchInterval: (query) => {
      const a = query.state.data as Analysis;
      return a?.status === 'processing' ? 2000 : false;
    },
  });

  const estimateMutation = useMutation({
    mutationFn: async (estimate: CostEstimate) => {
      const response = await apiRequest('POST', '/api/estimate', estimate);
      return response.json() as Promise<CostResult>;
    },
    onSuccess: (result) => { setCostResult(result); },
    onError: () => {
      toast({ title: "Estimation failed", description: "Please check your inputs.", variant: "destructive" });
    }
  });

  const handleExport = async () => {
    if (!analysis?.overallCoverage || !analysis.pageBreakdown) return;
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 18;
    const img = new Image();
    img.src = logoPath;
    await new Promise<void>((resolve) => { img.onload = () => resolve(); img.onerror = () => resolve(); });
    doc.setFillColor(10, 35, 16);
    doc.rect(0, 0, pageW, 42, "F");
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
    } catch (_) {}
    doc.setTextColor(255, 255, 255); doc.setFontSize(9);
    doc.text("Sterling Carter Technology Distributors", pageW - margin, 13, { align: "right" });
    doc.setFontSize(7.5);
    doc.text("15A Lady Musgrave Road, St. Andrew, Kingston 5, JAMAICA", pageW - margin, 19, { align: "right" });
    doc.text("info@sctdjm.com  |  (876) 968-6637", pageW - margin, 24, { align: "right" });
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("INK COVERAGE ANALYSIS REPORT", margin, 35);
    let y = 52;
    doc.setTextColor(30, 30, 30); doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text(`Analysis Mode: ${mode === "cmyk" ? "CMYK (4 channels)" : "Color + Black (2 cartridges)"}`, margin, y);
    doc.text(`Total Pages Analyzed: ${analysis.totalPages}`, pageW / 2, y, { align: "left" });
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - margin, y, { align: "right" });
    y += 10;
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(10, 45, 20);
    doc.text("Overall Ink Coverage", margin, y); y += 6;
    const cov = analysis.overallCoverage;
    const colorLoad = (cov.cyan + cov.magenta + cov.yellow) / 3;
    const coverageRows = mode === "cmyk"
      ? [["Cyan", `${cov.cyan.toFixed(2)}%`], ["Magenta", `${cov.magenta.toFixed(2)}%`], ["Yellow", `${cov.yellow.toFixed(2)}%`], ["Black", `${cov.black.toFixed(2)}%`], ["Total Ink Load", `${(cov.cyan + cov.magenta + cov.yellow + cov.black).toFixed(2)}%`]]
      : [["Color (CMY Average)", `${colorLoad.toFixed(2)}%`], ["Black", `${cov.black.toFixed(2)}%`]];
    autoTable(doc, { startY: y, head: [["Channel", "Coverage"]], body: coverageRows, margin: { left: margin, right: margin }, styles: { fontSize: 9 }, headStyles: { fillColor: [10, 45, 20], textColor: 255 }, alternateRowStyles: { fillColor: [240, 250, 242] } });
    y = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(10, 45, 20);
    doc.text("Page-by-Page Breakdown", margin, y); y += 4;
    const pages = analysis.pageBreakdown;
    const pageRows = pages.map((p) => { const pgColor = (p.cyan + p.magenta + p.yellow) / 3; return mode === "cmyk" ? [`Page ${p.page}`, `${p.cyan.toFixed(2)}%`, `${p.magenta.toFixed(2)}%`, `${p.yellow.toFixed(2)}%`, `${p.black.toFixed(2)}%`, `${p.total.toFixed(2)}%`] : [`Page ${p.page}`, `${pgColor.toFixed(2)}%`, `${p.black.toFixed(2)}%`, `${(pgColor + p.black).toFixed(2)}%`]; });
    const pageHead = mode === "cmyk" ? [["Page", "Cyan %", "Magenta %", "Yellow %", "Black %", "Total %"]] : [["Page", "Color %", "Black %", "Total %"]];
    autoTable(doc, { startY: y, head: pageHead, body: pageRows, margin: { left: margin, right: margin }, styles: { fontSize: 8 }, headStyles: { fillColor: [10, 45, 20], textColor: 255 }, alternateRowStyles: { fillColor: [248, 252, 249] } });
    y = (doc as any).lastAutoTable.finalY + 10;
    if (costResult) {
      if (y > 220) { doc.addPage(); y = 20; }
      doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(10, 45, 20);
      doc.text("Cost Estimation Results", margin, y); y += 6;
      const costSummary = [["Base Cost Per Page", `$${costResult.baseCostPerPage.toFixed(4)}`], [`With Waste (${wastePercent}%)`, `$${costResult.adjustedCostPerPage.toFixed(4)}`], ["Range (Min)", `$${costResult.rangeMin.toFixed(4)}`], ["Range (Max)", `$${costResult.rangeMax.toFixed(4)}`]];
      autoTable(doc, { startY: y, head: [["Description", "Amount / Page"]], body: costSummary, margin: { left: margin, right: margin }, styles: { fontSize: 9 }, headStyles: { fillColor: [10, 45, 20], textColor: 255 }, alternateRowStyles: { fillColor: [240, 250, 242] } });
      y = (doc as any).lastAutoTable.finalY + 6;
      const breakdownRows: string[][] = [];
      if (costResult.mode === "cmyk") {
        if (costResult.breakdown.cyan !== undefined) breakdownRows.push(["Cyan Cartridge", `$${costResult.breakdown.cyan.toFixed(4)}/page`]);
        if (costResult.breakdown.magenta !== undefined) breakdownRows.push(["Magenta Cartridge", `$${costResult.breakdown.magenta.toFixed(4)}/page`]);
        if (costResult.breakdown.yellow !== undefined) breakdownRows.push(["Yellow Cartridge", `$${costResult.breakdown.yellow.toFixed(4)}/page`]);
        if (costResult.breakdown.black !== undefined) breakdownRows.push(["Black Cartridge", `$${costResult.breakdown.black.toFixed(4)}/page`]);
      } else {
        if (costResult.breakdown.color !== undefined) breakdownRows.push(["Color Cartridge", `$${costResult.breakdown.color.toFixed(4)}/page`]);
        if (costResult.breakdown.black !== undefined) breakdownRows.push(["Black Cartridge", `$${costResult.breakdown.black.toFixed(4)}/page`]);
      }
      if (breakdownRows.length > 0) {
        autoTable(doc, { startY: y, head: [["Cartridge", "Cost/Page"]], body: breakdownRows, margin: { left: margin, right: margin }, styles: { fontSize: 9 }, headStyles: { fillColor: [46, 130, 60], textColor: 255 }, alternateRowStyles: { fillColor: [240, 250, 242] } });
        y = (doc as any).lastAutoTable.finalY + 6;
      }
      doc.setFontSize(7.5); doc.setFont("helvetica", "italic"); doc.setTextColor(120, 120, 120);
      doc.text("Formula: effective yield = rated yield × (5% ÷ actual coverage%). Range shows ±8% variation.", margin, y);
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
    doc.save("ink-coverage-report.pdf");
    toast({ title: "Report exported", description: "Your PDF report has been downloaded." });
  };

  const handleCalculateCost = () => {
    if (!analysis?.overallCoverage) return;
    const estimate: CostEstimate = { mode, coverage: analysis.overallCoverage, wastePercent: parseFloat(wastePercent) || 10 };
    if (mode === "cmyk") {
      estimate.cyanYield = parseFloat(cyanYield); estimate.cyanPrice = parseFloat(cyanPrice);
      estimate.magentaYield = parseFloat(magentaYield); estimate.magentaPrice = parseFloat(magentaPrice);
      estimate.yellowYield = parseFloat(yellowYield); estimate.yellowPrice = parseFloat(yellowPrice);
      estimate.blackYield = parseFloat(blackYield); estimate.blackPrice = parseFloat(blackPrice);
    } else {
      estimate.colorYield = parseFloat(colorYield); estimate.colorPrice = parseFloat(colorPrice);
      estimate.blackYield = parseFloat(cbBlackYield); estimate.blackPrice = parseFloat(cbBlackPrice);
    }
    estimateMutation.mutate(estimate);
  };

  if (!analysisId) return null;

  const greenSpinner = (
    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "hsl(133, 55%, 40%)", borderTopColor: "transparent" }} />
  );

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-gray-100 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!analysis) return null;

  if (analysis.status === 'processing') {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
            <div className="w-14 h-14 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-5" style={{ borderColor: "hsl(133, 55%, 40%)", borderTopColor: "transparent" }} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Document</h3>
            <p className="text-gray-500">Calculating ink coverage per page. This may take a few minutes for large documents.</p>
          </div>
        </div>
      </section>
    );
  }

  if (analysis.status === 'failed') {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-800 mb-1">Analysis Failed</h3>
            <p className="text-gray-600">{analysis.errorMessage || "Please try uploading your document again."}</p>
          </div>
        </div>
      </section>
    );
  }

  if (analysis.status !== 'completed' || !analysis.overallCoverage || !analysis.pageBreakdown) return null;

  const cov = analysis.overallCoverage;
  const pages = analysis.pageBreakdown;
  const colorLoad = (cov.cyan + cov.magenta + cov.yellow) / 3;
  const displayPages = showAllPages ? pages : pages.slice(0, 5);

  return (
    <section id="results" className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="section-label mb-1">Results</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Analysis Results</h2>
            <p className="text-gray-500 text-sm">
              {analysis.totalPages} page{analysis.totalPages !== 1 ? 's' : ''} analyzed
              &nbsp;·&nbsp;
              Mode: <span className="font-medium">{mode === "cmyk" ? "CMYK" : "Color + Black"}</span>
            </p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-semibold text-sm transition-all"
            style={{ borderColor: "hsl(133, 48%, 36%)", color: "hsl(133, 48%, 36%)" }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "hsl(133, 48%, 96%)"; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = ""; }}
          >
            <Download className="w-4 h-4" />
            Export PDF Report
          </button>
        </div>

        {/* Coverage Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <h3 className="text-base font-bold text-gray-900 mb-1">Overall Ink Coverage</h3>
          <p className="text-sm text-gray-400 mb-5">Average across all pages</p>
          <div className="space-y-3">
            {mode === "cmyk" ? (
              <>
                <CoverageBar label="Cyan" value={cov.cyan} color="bg-cyan-500" bgColor="bg-cyan-50" textColor="text-cyan-900" />
                <CoverageBar label="Magenta" value={cov.magenta} color="bg-pink-500" bgColor="bg-pink-50" textColor="text-pink-900" />
                <CoverageBar label="Yellow" value={cov.yellow} color="bg-yellow-400" bgColor="bg-yellow-50" textColor="text-yellow-900" />
                <CoverageBar label="Black" value={cov.black} color="bg-gray-800" bgColor="bg-gray-100" textColor="text-gray-900" />
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm font-semibold text-gray-700">
                    <span>Total ink load</span>
                    <span>{(cov.cyan + cov.magenta + cov.yellow + cov.black).toFixed(2)}%</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <CoverageBar label="Color (CMY average)" value={colorLoad} color="bg-green-500" bgColor="bg-green-50" textColor="text-green-900" />
                <CoverageBar label="Black" value={cov.black} color="bg-gray-800" bgColor="bg-gray-100" textColor="text-gray-900" />
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Color load is the average of Cyan ({cov.cyan.toFixed(2)}%), Magenta ({cov.magenta.toFixed(2)}%), Yellow ({cov.yellow.toFixed(2)}%)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Page-by-Page Table */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <h3 className="text-base font-bold text-gray-900 mb-5">Page-by-Page Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="text-left py-3 px-3 font-semibold">Page</th>
                  {mode === "cmyk" ? (
                    <>
                      <th className="text-right py-3 px-3 font-semibold text-cyan-700">Cyan %</th>
                      <th className="text-right py-3 px-3 font-semibold text-pink-700">Magenta %</th>
                      <th className="text-right py-3 px-3 font-semibold text-yellow-700">Yellow %</th>
                      <th className="text-right py-3 px-3 font-semibold text-gray-700">Black %</th>
                      <th className="text-right py-3 px-3 font-semibold text-gray-700">Total %</th>
                    </>
                  ) : (
                    <>
                      <th className="text-right py-3 px-3 font-semibold text-green-700">Color %</th>
                      <th className="text-right py-3 px-3 font-semibold text-gray-700">Black %</th>
                      <th className="text-right py-3 px-3 font-semibold text-gray-700">Total %</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayPages.map((page) => {
                  const pgColorLoad = (page.cyan + page.magenta + page.yellow) / 3;
                  return (
                    <tr key={page.page} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-gray-800">Page {page.page}</td>
                      {mode === "cmyk" ? (
                        <>
                          <td className="py-3 px-3 text-right text-cyan-700">{page.cyan.toFixed(2)}%</td>
                          <td className="py-3 px-3 text-right text-pink-700">{page.magenta.toFixed(2)}%</td>
                          <td className="py-3 px-3 text-right text-yellow-700">{page.yellow.toFixed(2)}%</td>
                          <td className="py-3 px-3 text-right text-gray-700">{page.black.toFixed(2)}%</td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">{page.total.toFixed(2)}%</td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-3 text-right text-green-700">{pgColorLoad.toFixed(2)}%</td>
                          <td className="py-3 px-3 text-right text-gray-700">{page.black.toFixed(2)}%</td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">{(pgColorLoad + page.black).toFixed(2)}%</td>
                        </>
                      )}
                    </tr>
                  );
                })}
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
                {showAllPages ? (
                  <><ChevronUp className="w-4 h-4" /> Show less</>
                ) : (
                  <><ChevronDown className="w-4 h-4" /> Show all {pages.length} pages</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Cost Estimator */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(133, 48%, 94%)" }}>
              <Calculator className="w-5 h-5" style={{ color: "hsl(133, 48%, 36%)" }} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Cost Estimator</h3>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Based on your ink coverage. Cartridge yield is typically rated at 5% page coverage.
          </p>

          <div className="space-y-6">
            {mode === "cmyk" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Cyan", yield: cyanYield, setYield: setCyanYield, price: cyanPrice, setPrice: setCyanPrice, accent: "text-cyan-700", bg: "bg-cyan-50" },
                  { label: "Magenta", yield: magentaYield, setYield: setMagentaYield, price: magentaPrice, setPrice: setMagentaPrice, accent: "text-pink-700", bg: "bg-pink-50" },
                  { label: "Yellow", yield: yellowYield, setYield: setYellowYield, price: yellowPrice, setPrice: setYellowPrice, accent: "text-yellow-700", bg: "bg-yellow-50" },
                  { label: "Black", yield: blackYield, setYield: setBlackYield, price: blackPrice, setPrice: setBlackPrice, accent: "text-gray-800", bg: "bg-gray-100" },
                ].map((ch) => (
                  <div key={ch.label} className={`p-4 ${ch.bg} rounded-xl`}>
                    <p className={`font-bold mb-3 ${ch.accent} text-sm`}>{ch.label} Cartridge</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Rated yield (pages)</Label>
                        <Input value={ch.yield} onChange={(e) => ch.setYield(e.target.value)} type="number" min="1" className="bg-white h-9 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Price (USD $)</Label>
                        <Input value={ch.price} onChange={(e) => ch.setPrice(e.target.value)} type="number" min="0" step="0.01" className="bg-white h-9 text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="font-bold mb-3 text-green-800 text-sm">Color Cartridge</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Rated yield (pages)</Label>
                      <Input value={colorYield} onChange={(e) => setColorYield(e.target.value)} type="number" min="1" className="bg-white h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Price (USD $)</Label>
                      <Input value={colorPrice} onChange={(e) => setColorPrice(e.target.value)} type="number" min="0" step="0.01" className="bg-white h-9 text-sm" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-100 rounded-xl">
                  <p className="font-bold mb-3 text-gray-800 text-sm">Black Cartridge</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Rated yield (pages)</Label>
                      <Input value={cbBlackYield} onChange={(e) => setCbBlackYield(e.target.value)} type="number" min="1" className="bg-white h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Price (USD $)</Label>
                      <Input value={cbBlackPrice} onChange={(e) => setCbBlackPrice(e.target.value)} type="number" min="0" step="0.01" className="bg-white h-9 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Waste Factor */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Waste / Variation Factor (%)</Label>
              <div className="flex items-center gap-4">
                <Input
                  value={wastePercent}
                  onChange={(e) => setWastePercent(e.target.value)}
                  type="number" min="0" max="100" step="1"
                  className="max-w-[120px] h-9 text-sm bg-white"
                />
                <p className="text-xs text-gray-500">
                  Accounts for cleaning cycles, residual ink, and calibration waste. Default: 10% for inkjet, 3–6% for laser.
                </p>
              </div>
            </div>

            {/* Calculate button */}
            <button
              onClick={handleCalculateCost}
              disabled={estimateMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-white text-sm transition-all disabled:opacity-50"
              style={{ background: "hsl(133, 55%, 40%)" }}
            >
              {estimateMutation.isPending ? (
                <>{greenSpinner} Calculating...</>
              ) : (
                <><Calculator className="w-4 h-4" /> Calculate Cost Per Page</>
              )}
            </button>

            {/* Results */}
            {costResult && (
              <div className="rounded-xl overflow-hidden border border-green-200">
                <div className="px-5 py-3 font-bold text-sm text-white" style={{ background: "hsl(133, 55%, 40%)" }}>
                  Cost Results
                </div>
                <div className="grid sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-green-100">
                  {[
                    { label: "Base Cost / Page", value: `$${costResult.baseCostPerPage.toFixed(4)}`, sub: "At exact coverage" },
                    { label: `Adjusted (+${wastePercent}% waste)`, value: `$${costResult.adjustedCostPerPage.toFixed(4)}`, sub: "Recommended estimate" },
                    { label: "Range (Min)", value: `$${costResult.rangeMin.toFixed(4)}`, sub: "−8% variation" },
                    { label: "Range (Max)", value: `$${costResult.rangeMax.toFixed(4)}`, sub: "+8% variation" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 bg-green-50">
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="text-xl font-bold" style={{ color: "hsl(133, 48%, 30%)" }}>{item.value}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Cartridge breakdown */}
                {Object.keys(costResult.breakdown).length > 0 && (
                  <div className="px-5 py-4 bg-white border-t border-green-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Cartridge Breakdown</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {costResult.mode === "cmyk" ? (
                        <>
                          {costResult.breakdown.cyan !== undefined && (
                            <div className="text-center p-3 bg-cyan-50 rounded-xl">
                              <p className="text-xs text-cyan-600 font-semibold mb-1">Cyan</p>
                              <p className="text-sm font-bold text-cyan-900">${costResult.breakdown.cyan.toFixed(4)}</p>
                            </div>
                          )}
                          {costResult.breakdown.magenta !== undefined && (
                            <div className="text-center p-3 bg-pink-50 rounded-xl">
                              <p className="text-xs text-pink-600 font-semibold mb-1">Magenta</p>
                              <p className="text-sm font-bold text-pink-900">${costResult.breakdown.magenta.toFixed(4)}</p>
                            </div>
                          )}
                          {costResult.breakdown.yellow !== undefined && (
                            <div className="text-center p-3 bg-yellow-50 rounded-xl">
                              <p className="text-xs text-yellow-600 font-semibold mb-1">Yellow</p>
                              <p className="text-sm font-bold text-yellow-900">${costResult.breakdown.yellow.toFixed(4)}</p>
                            </div>
                          )}
                          {costResult.breakdown.black !== undefined && (
                            <div className="text-center p-3 bg-gray-100 rounded-xl">
                              <p className="text-xs text-gray-600 font-semibold mb-1">Black</p>
                              <p className="text-sm font-bold text-gray-900">${costResult.breakdown.black.toFixed(4)}</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {costResult.breakdown.color !== undefined && (
                            <div className="text-center p-3 bg-green-50 rounded-xl">
                              <p className="text-xs text-green-600 font-semibold mb-1">Color</p>
                              <p className="text-sm font-bold text-green-900">${costResult.breakdown.color.toFixed(4)}</p>
                            </div>
                          )}
                          {costResult.breakdown.black !== undefined && (
                            <div className="text-center p-3 bg-gray-100 rounded-xl">
                              <p className="text-xs text-gray-600 font-semibold mb-1">Black</p>
                              <p className="text-sm font-bold text-gray-900">${costResult.breakdown.black.toFixed(4)}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Formula: effective yield = rated yield × (5% ÷ actual coverage%). Range shows ±8% variation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
