import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload, FileText, Play, Printer, Layers, ShieldAlert, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type {
  Document,
  AnalysisSettings,
  PageSizePreset,
  ColorMode,
  PrinterType,
} from "@shared/schema";
import { PAGE_SIZE_PRESETS } from "@shared/schema";
import { DocumentPreview } from "@/components/document-preview";
import { Link } from "wouter";

interface FileUploadProps {
  onAnalysisStart: (analysisId: number, settings: AnalysisSettings) => void;
}

const DPI_OPTIONS: Array<72 | 150 | 300 | 600> = [72, 150, 300, 600];
const PAGE_PRESETS: PageSizePreset[] = ["Auto", "A4", "Letter", "Legal", "Tabloid", "Custom"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({ onAnalysisStart }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<Document | null>(null);
  const [printerType, setPrinterType] = useState<PrinterType>("cmyk");
  const [colorMode, setColorMode] = useState<ColorMode>("color");
  const [resolutionDPI, setResolutionDPI] = useState<72 | 150 | 300 | 600>(150);
  const [pagePreset, setPagePreset] = useState<PageSizePreset>("Auto");
  const [widthMM, setWidthMM] = useState<string>("210");
  const [heightMM, setHeightMM] = useState<string>("297");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { toast } = useToast();

  // Sync preset → dimensions
  useEffect(() => {
    if (pagePreset === "Custom" || pagePreset === "Auto") return;
    const p = PAGE_SIZE_PRESETS[pagePreset];
    if (p) {
      setWidthMM(String(p.widthMM));
      setHeightMM(String(p.heightMM));
    }
  }, [pagePreset]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiRequest("POST", "/api/documents/upload", formData);
      return response.json() as Promise<Document>;
    },
    onSuccess: async (document: Document) => {
      setUploadedFile(document);
      toast({ title: "File uploaded", description: `${document.originalName} is ready for analysis.` });
      try {
        const r = await apiRequest("GET", `/api/documents/${document.id}/page-info`);
        const info = await r.json();
        if (info.isPDF && info.widthMM && info.heightMM) {
          setPagePreset("Auto");
          setWidthMM(String(info.widthMM));
          setHeightMM(String(info.heightMM));
        }
      } catch {}
    },
    onError: (error: Error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (settings: AnalysisSettings) => {
      if (!uploadedFile) throw new Error("No file");
      const response = await apiRequest("POST", `/api/documents/${uploadedFile.id}/analyze`, settings);
      return response.json();
    },
    onSuccess: (analysis, settings) => {
      onAnalysisStart(analysis.id, settings);
    },
    onError: () => {
      toast({ title: "Analysis failed to start", description: "Please try again.", variant: "destructive" });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!termsAccepted) {
        toast({
          title: "Agreement required",
          description: "Please accept the Terms of Service and Privacy Policy before uploading.",
          variant: "destructive",
        });
        return;
      }
      if (acceptedFiles[0]) uploadMutation.mutate(acceptedFiles[0]);
    },
    [uploadMutation, termsAccepted, toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/postscript": [".eps"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/tiff": [".tiff", ".tif"],
    },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
  });

  const buildSettings = (): AnalysisSettings => {
    const w = parseFloat(widthMM);
    const h = parseFloat(heightMM);
    return {
      printerType,
      colorMode,
      pageSize: {
        preset: pagePreset,
        widthMM: isFinite(w) ? w : 210,
        heightMM: isFinite(h) ? h : 297,
      },
      resolutionDPI,
    };
  };

  const handleStartAnalysis = () => {
    if (!uploadedFile) {
      toast({ title: "No file selected", description: "Please upload a file first.", variant: "destructive" });
      return;
    }
    const w = parseFloat(widthMM);
    const h = parseFloat(heightMM);
    if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0) {
      toast({ title: "Invalid page size", description: "Please enter valid width and height in mm.", variant: "destructive" });
      return;
    }
    analyzeMutation.mutate(buildSettings());
  };

  const printerLabel = printerType === "cmyk" ? "CMYK Cartridge Analysis" : "Color & Black Cartridge";
  const modeLabel = colorMode === "color" ? "Color Print" : "Black & White Print";

  return (
    <section id="estimator" className="py-20" style={{ background: "hsl(120, 8%, 97%)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Professional Tool</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Ink &amp; Toner Coverage Estimator</h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Pick your printer setup, choose Color or Black &amp; White, then page size and resolution. Upload to get accurate cartridge coverage and per-page cost.
          </p>
        </div>

        <div
          className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07), 0 16px 40px rgba(0,0,0,0.06)" }}
        >
          {/* Step 1: Printer Type */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Step 1 — Printer / Cartridge Type</h3>
            <p className="text-xs text-gray-400 mb-4">Choose how your printer's cartridges are configured.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPrinterType("cmyk")}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  printerType === "cmyk" ? "border-green-600 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Droplets className={`w-5 h-5 mt-0.5 ${printerType === "cmyk" ? "text-green-700" : "text-gray-400"}`} />
                <div>
                  <div className={`font-semibold text-sm ${printerType === "cmyk" ? "text-green-900" : "text-gray-700"}`}>
                    CMYK Cartridge Analysis
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    4 separate cartridges. Shows individual coverage for Cyan, Magenta, Yellow, and Black.
                  </div>
                </div>
              </button>
              <button
                onClick={() => setPrinterType("color-black")}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  printerType === "color-black" ? "border-green-600 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Printer className={`w-5 h-5 mt-0.5 ${printerType === "color-black" ? "text-green-700" : "text-gray-400"}`} />
                <div>
                  <div className={`font-semibold text-sm ${printerType === "color-black" ? "text-green-900" : "text-gray-700"}`}>
                    Color &amp; Black (Inkjet)
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Standard 2-cartridge inkjet. Shows combined Color cartridge usage and Black cartridge usage.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Print Mode */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Step 2 — Print Mode</h3>
            <p className="text-xs text-gray-400 mb-4">Will the document be printed in color or black &amp; white?</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setColorMode("color")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  colorMode === "color" ? "border-green-600 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Layers className={`w-5 h-5 ${colorMode === "color" ? "text-green-700" : "text-gray-400"}`} />
                <div>
                  <div className={`font-semibold text-sm ${colorMode === "color" ? "text-green-900" : "text-gray-700"}`}>Color Print</div>
                  <div className="text-xs text-gray-500 mt-0.5">Uses every cartridge as needed.</div>
                </div>
              </button>
              <button
                onClick={() => setColorMode("bw")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  colorMode === "bw" ? "border-green-600 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Printer className={`w-5 h-5 ${colorMode === "bw" ? "text-green-700" : "text-gray-400"}`} />
                <div>
                  <div className={`font-semibold text-sm ${colorMode === "bw" ? "text-green-900" : "text-gray-700"}`}>Black &amp; White Print</div>
                  <div className="text-xs text-gray-500 mt-0.5">Only the black cartridge is used.</div>
                </div>
              </button>
            </div>
          </div>

          {/* Step 3: Page Size & Resolution */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Step 3 — Page Size &amp; Resolution</h3>
            <p className="text-xs text-gray-400 mb-4">All coverage values are calibrated to this page size.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Page Preset</Label>
                <select
                  value={pagePreset}
                  onChange={(e) => setPagePreset(e.target.value as PageSizePreset)}
                  className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm"
                >
                  {PAGE_PRESETS.map((p) => (
                    <option key={p} value={p}>{p}{p === "Auto" ? " (detect from file)" : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Width (mm)</Label>
                <Input
                  type="number" min="10" step="0.1"
                  value={widthMM}
                  onChange={(e) => { setWidthMM(e.target.value); if (pagePreset !== "Custom" && pagePreset !== "Auto") setPagePreset("Custom"); }}
                  className="h-10 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Height (mm)</Label>
                <Input
                  type="number" min="10" step="0.1"
                  value={heightMM}
                  onChange={(e) => { setHeightMM(e.target.value); if (pagePreset !== "Custom" && pagePreset !== "Auto") setPagePreset("Custom"); }}
                  className="h-10 text-sm"
                />
              </div>
            </div>
            <Label className="text-xs text-gray-500 mb-2 mt-4 block">Resolution (DPI)</Label>
            <div className="grid grid-cols-4 gap-3">
              {DPI_OPTIONS.map((dpi) => (
                <button
                  key={dpi}
                  onClick={() => setResolutionDPI(dpi)}
                  className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    resolutionDPI === dpi ? "border-green-600 bg-green-50 text-green-800" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {dpi} DPI
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Agreement Required</h3>
            <div className={`rounded-xl border-2 p-4 transition-colors ${termsAccepted ? "border-green-300 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {termsAccepted ? (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "hsl(133, 55%, 40%)" }}>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <ShieldAlert className="w-6 h-6 text-amber-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold mb-1 ${termsAccepted ? "text-green-800" : "text-amber-800"}`}>
                    {termsAccepted ? "You have agreed to the terms" : "Please agree before uploading"}
                  </p>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    By uploading a document you confirm that you have read and agree to our{" "}
                    <Link href="/terms-of-service" className="font-medium hover:underline" style={{ color: "hsl(133, 48%, 36%)" }}>Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="font-medium hover:underline" style={{ color: "hsl(133, 48%, 36%)" }}>Privacy Policy</Link>.
                    Your document is processed for coverage analysis only and is not retained.
                  </p>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="terms-accept"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <label htmlFor="terms-accept" className="text-sm text-gray-700 cursor-pointer select-none font-medium">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Step 4 — Upload Document</h3>
            {!uploadedFile ? (
              <div
                {...(termsAccepted ? getRootProps() : {})}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  !termsAccepted
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    : isDragActive ? "cursor-pointer" : "border-gray-300 hover:border-green-500 hover:bg-green-50/50 cursor-pointer"
                }`}
                style={isDragActive && termsAccepted ? { borderColor: "hsl(133, 55%, 40%)", background: "hsl(133, 48%, 97%)" } : {}}
              >
                {termsAccepted && <input {...getInputProps()} />}
                <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: "hsl(133, 48%, 94%)" }}>
                  <Upload className={`w-7 h-7 ${termsAccepted ? "" : "text-gray-300"}`} style={termsAccepted ? { color: "hsl(133, 48%, 36%)" } : {}} />
                </div>
                <p className={`text-base font-semibold mb-1 ${termsAccepted ? "text-gray-800" : "text-gray-400"}`}>
                  {!termsAccepted ? "Accept the terms above to enable upload" : isDragActive ? "Drop your file here" : "Drag & drop or click to browse"}
                </p>
                <p className="text-sm text-gray-400">PDF, PNG, JPG, TIFF, EPS — up to 50 MB</p>
                {uploadMutation.isPending && (
                  <div className="mt-5 flex items-center justify-center gap-2" style={{ color: "hsl(133, 55%, 40%)" }}>
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "hsl(133, 55%, 40%)", borderTopColor: "transparent" }} />
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(133, 48%, 90%)" }}>
                    <FileText className="w-5 h-5" style={{ color: "hsl(133, 48%, 36%)" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{uploadedFile.originalName}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.fileSize)}</p>
                  </div>
                </div>
                <button onClick={() => setUploadedFile(null)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Analyze button */}
          <div className="text-center">
            <button
              onClick={handleStartAnalysis}
              disabled={!uploadedFile || analyzeMutation.isPending || !termsAccepted}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-white text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "hsl(133, 55%, 40%)",
                boxShadow: uploadedFile && !analyzeMutation.isPending ? "0 4px 20px rgba(46,160,80,0.35)" : "none",
              }}
            >
              {analyzeMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Starting Analysis...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Analyze Coverage
                </>
              )}
            </button>
            {uploadedFile && (
              <p className="text-sm text-gray-400 mt-3">
                {printerLabel} · {modeLabel} · {resolutionDPI} DPI · {pagePreset} ({widthMM}×{heightMM} mm)
              </p>
            )}
          </div>
        </div>

        {uploadedFile && (
          <div className="mt-6">
            <DocumentPreview document={uploadedFile} />
          </div>
        )}
      </div>
    </section>
  );
}
