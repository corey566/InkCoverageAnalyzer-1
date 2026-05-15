import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  Upload,
  FileText,
  Play,
  Printer,
  Layers,
  ShieldAlert,
  Droplets,
} from "lucide-react";
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
const PAGE_PRESETS: PageSizePreset[] = [
  "Auto",
  "A4",
  "Letter",
  "Legal",
  "Tabloid",
  "Custom",
];

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
      const response = await apiRequest(
        "POST",
        "/api/documents/upload",
        formData,
      );
      return response.json() as Promise<Document>;
    },
    onSuccess: async (document: Document) => {
      setUploadedFile(document);
      toast({
        title: "File uploaded",
        description: `${document.originalName} is ready for analysis.`,
      });
      try {
        const r = await apiRequest(
          "GET",
          `/api/documents/${document.id}/page-info`,
        );
        const info = await r.json();
        if (info.isPDF && info.widthMM && info.heightMM) {
          setPagePreset("Auto");
          setWidthMM(String(info.widthMM));
          setHeightMM(String(info.heightMM));
        }
      } catch {}
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (settings: AnalysisSettings) => {
      if (!uploadedFile) throw new Error("No file");
      const response = await apiRequest(
        "POST",
        `/api/documents/${uploadedFile.id}/analyze`,
        settings,
      );
      return response.json();
    },
    onSuccess: (analysis, settings) => {
      onAnalysisStart(analysis.id, settings);

      // Bring the user straight to the live processing/results area.
      // The small timeout gives the parent component time to render #results.
      window.setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    },
    onError: () => {
      toast({
        title: "Analysis failed to start",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!termsAccepted) {
        toast({
          title: "Agreement required",
          description:
            "Please accept the Terms of Service and Privacy Policy before uploading.",
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
      toast({
        title: "No file selected",
        description: "Please upload a file first.",
        variant: "destructive",
      });
      return;
    }
    const w = parseFloat(widthMM);
    const h = parseFloat(heightMM);
    if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0) {
      toast({
        title: "Invalid page size",
        description: "Please enter valid width and height in mm.",
        variant: "destructive",
      });
      return;
    }
    analyzeMutation.mutate(buildSettings());
  };

  const printerLabel =
    printerType === "cmyk"
      ? "CMYK Cartridge Analysis"
      : "Color & Black Cartridge";
  const modeLabel =
    colorMode === "color" ? "Color Print" : "Black & White Print";

  return (
    <section
      id="estimator"
      className="py-10 md:py-12 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 8% 8%, rgba(34,197,94,0.25) 0, transparent 26%), radial-gradient(circle at 92% 12%, rgba(96,165,250,0.30) 0, transparent 28%), radial-gradient(circle at 50% 0%, rgba(250,204,21,0.28) 0, transparent 30%), linear-gradient(135deg, #f0fdf4 0%, #ecfeff 38%, #f7fee7 70%, #ffffff 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <p className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-100 via-lime-100 to-cyan-100 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm mb-3 border border-white">
            Friendly Print Helper
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Ink &amp; Toner Coverage Estimator ✅
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
            Choose your print setup step-by-step, upload your file, and get a
            clear ink coverage estimate without the complicated feeling.
          </p>
        </div>

        <div
          className={`grid gap-5 ${uploadedFile ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start" : "max-w-4xl mx-auto"}`}
        >
          <div
            className="bg-white/85 backdrop-blur rounded-[2.25rem] border-2 border-white p-5 md:p-6 space-y-5 relative overflow-hidden"
            style={{
              boxShadow:
                "0 24px 80px rgba(22,163,74,0.16), 0 14px 40px rgba(14,165,233,0.12), 0 8px 24px rgba(15,23,42,0.06)",
            }}
          >
            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-green-200/50 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-cyan-200/50 blur-2xl" />
            <div className="pointer-events-none absolute top-20 left-1/2 h-20 w-20 rounded-full bg-yellow-200/40 blur-xl" />

            {/* Step 1: Printer Type */}
            <div>
              <h3 className="text-xs font-black text-green-700 uppercase tracking-[0.18em] mb-1">
                🌟 1. Pick your printer buddy
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                Choose how your printer's cartridges are configured.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPrinterType("cmyk")}
                  className={`flex items-start gap-3 p-3 rounded-3xl border-2 text-left transition-all duration-200 ${
                    printerType === "cmyk"
                      ? "border-green-400 bg-gradient-to-br from-green-50 via-lime-50 to-cyan-50 shadow-lg shadow-green-100 scale-[1.02]"
                      : "border-slate-200 bg-white hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-cyan-50 hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <Droplets
                    className={`w-5 h-5 mt-0.5 ${printerType === "cmyk" ? "text-green-700" : "text-slate-400"}`}
                  />
                  <div>
                    <div
                      className={`font-semibold text-sm ${printerType === "cmyk" ? "text-green-900" : "text-slate-700"}`}
                    >
                      CMYK Cartridge Analysis
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      4 separate cartridges. Shows individual coverage for Cyan,
                      Magenta, Yellow, and Black.
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setPrinterType("color-black")}
                  className={`flex items-start gap-3 p-3 rounded-3xl border-2 text-left transition-all duration-200 ${
                    printerType === "color-black"
                      ? "border-green-400 bg-gradient-to-br from-green-50 via-lime-50 to-cyan-50 shadow-lg shadow-green-100 scale-[1.02]"
                      : "border-slate-200 bg-white hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-cyan-50 hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <Printer
                    className={`w-5 h-5 mt-0.5 ${printerType === "color-black" ? "text-green-700" : "text-slate-400"}`}
                  />
                  <div>
                    <div
                      className={`font-semibold text-sm ${printerType === "color-black" ? "text-green-900" : "text-slate-700"}`}
                    >
                      Color &amp; Black (Inkjet)
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Standard 2-cartridge inkjet. Shows combined Color
                      cartridge usage and Black cartridge usage.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Print Mode */}
            <div>
              <h3 className="text-xs font-black text-green-700 uppercase tracking-[0.18em] mb-1">
                🎨 2. Choose print style
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                Will the document be printed in color or black &amp; white?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setColorMode("color")}
                  className={`flex items-center gap-3 p-3 rounded-3xl border-2 text-left transition-all duration-200 ${
                    colorMode === "color"
                      ? "border-green-400 bg-gradient-to-br from-green-50 via-lime-50 to-cyan-50 shadow-lg shadow-green-100 scale-[1.02]"
                      : "border-slate-200 bg-white hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-cyan-50 hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <Layers
                    className={`w-5 h-5 ${colorMode === "color" ? "text-green-700" : "text-slate-400"}`}
                  />
                  <div>
                    <div
                      className={`font-semibold text-sm ${colorMode === "color" ? "text-green-900" : "text-slate-700"}`}
                    >
                      Color Print
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Uses every cartridge as needed.
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setColorMode("bw")}
                  className={`flex items-center gap-3 p-3 rounded-3xl border-2 text-left transition-all duration-200 ${
                    colorMode === "bw"
                      ? "border-green-400 bg-gradient-to-br from-green-50 via-lime-50 to-cyan-50 shadow-lg shadow-green-100 scale-[1.02]"
                      : "border-slate-200 bg-white hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-cyan-50 hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <Printer
                    className={`w-5 h-5 ${colorMode === "bw" ? "text-green-700" : "text-slate-400"}`}
                  />
                  <div>
                    <div
                      className={`font-semibold text-sm ${colorMode === "bw" ? "text-green-900" : "text-slate-700"}`}
                    >
                      Black &amp; White Print
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Only the black cartridge is used.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 3: Page Size & Resolution */}
            <div>
              <h3 className="text-xs font-black text-green-700 uppercase tracking-[0.18em] mb-1">
                📄 3. Paper size &amp; quality
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                All coverage values are calibrated to this page size.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-slate-500 mb-1 block">
                    Page Preset
                  </Label>
                  <select
                    value={pagePreset}
                    onChange={(e) =>
                      setPagePreset(e.target.value as PageSizePreset)
                    }
                    className="w-full h-11 rounded-2xl border-2 border-sky-100 bg-white px-3 text-sm shadow-sm focus:border-green-400"
                  >
                    {PAGE_PRESETS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                        {p === "Auto" ? " (detect from file)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-slate-500 mb-1 block">
                    Width (mm)
                  </Label>
                  <Input
                    type="number"
                    min="10"
                    step="0.1"
                    value={widthMM}
                    onChange={(e) => {
                      setWidthMM(e.target.value);
                      if (pagePreset !== "Custom" && pagePreset !== "Auto")
                        setPagePreset("Custom");
                    }}
                    className="h-11 text-sm rounded-2xl border-2 border-sky-100 bg-white shadow-sm focus-visible:ring-green-200"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500 mb-1 block">
                    Height (mm)
                  </Label>
                  <Input
                    type="number"
                    min="10"
                    step="0.1"
                    value={heightMM}
                    onChange={(e) => {
                      setHeightMM(e.target.value);
                      if (pagePreset !== "Custom" && pagePreset !== "Auto")
                        setPagePreset("Custom");
                    }}
                    className="h-11 text-sm rounded-2xl border-2 border-sky-100 bg-white shadow-sm focus-visible:ring-green-200"
                  />
                </div>
              </div>
              <Label className="text-xs text-slate-500 mb-2 mt-4 block">
                Resolution (DPI)
              </Label>
              <div className="grid grid-cols-4 gap-3">
                {DPI_OPTIONS.map((dpi) => (
                  <button
                    key={dpi}
                    onClick={() => setResolutionDPI(dpi)}
                    className={`py-3 rounded-3xl border-2 text-sm font-semibold transition-all duration-200 ${
                      resolutionDPI === dpi
                        ? "border-green-400 bg-gradient-to-br from-green-50 via-lime-50 to-cyan-50 shadow-lg shadow-green-100 scale-[1.02] text-green-800"
                        : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-cyan-50 hover:-translate-y-1 hover:shadow-md"
                    }`}
                  >
                    {dpi} DPI
                  </button>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div>
              <h3 className="text-xs font-black text-green-700 uppercase tracking-[0.18em] mb-4">
                🛡️ Safety check
              </h3>
              <div
                className={`rounded-3xl border-2 p-4 transition-colors ${termsAccepted ? "border-lime-300 bg-gradient-to-r from-lime-50 to-emerald-50" : "border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {termsAccepted ? (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #15803d 0%, #16a34a 45%, #22c55e 100%)",
                        }}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    ) : (
                      <ShieldAlert className="w-6 h-6 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold mb-1 ${termsAccepted ? "text-green-800" : "text-amber-800"}`}
                    >
                      {termsAccepted
                        ? "You have agreed to the terms"
                        : "Please agree before uploading"}
                    </p>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      By uploading a document you confirm that you have read and
                      agree to our{" "}
                      <Link
                        href="/terms-of-service"
                        className="font-medium hover:underline"
                        style={{ color: "#15803d" }}
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="font-medium hover:underline"
                        style={{ color: "#15803d" }}
                      >
                        Privacy Policy
                      </Link>
                      . Your document is processed for coverage analysis only
                      and is not retained.
                    </p>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="terms-accept"
                        checked={termsAccepted}
                        onCheckedChange={(checked) =>
                          setTermsAccepted(checked === true)
                        }
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <label
                        htmlFor="terms-accept"
                        className="text-sm text-slate-700 cursor-pointer select-none font-medium"
                      >
                        I agree to the Terms of Service and Privacy Policy
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload */}
            <div>
              <h3 className="text-xs font-black text-green-700 uppercase tracking-[0.18em] mb-3">
                🚀 4. Drop your file here
              </h3>
              {!uploadedFile ? (
                <div
                  {...(termsAccepted ? getRootProps() : {})}
                  className={`border-2 border-dashed rounded-3xl p-6 md:p-8 text-center transition-all duration-200 ${
                    !termsAccepted
                      ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
                      : isDragActive
                        ? "cursor-pointer"
                        : "border-sky-300 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:via-yellow-50 hover:to-cyan-50 cursor-pointer hover:-translate-y-1 hover:shadow-xl"
                  }`}
                  style={
                    isDragActive && termsAccepted
                      ? {
                          borderColor: "#16a34a",
                          background:
                            "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
                        }
                      : {}
                  }
                >
                  {termsAccepted && <input {...getInputProps()} />}
                  <div
                    className="w-14 h-14 rounded-[1.5rem] mx-auto mb-5 flex items-center justify-center shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #dcfce7 0%, #ecfccb 45%, #cffafe 100%)",
                    }}
                  >
                    <Upload
                      className={`w-7 h-7 ${termsAccepted ? "" : "text-gray-300"}`}
                      style={termsAccepted ? { color: "#15803d" } : {}}
                    />
                  </div>
                  <p
                    className={`text-base font-semibold mb-1 ${termsAccepted ? "text-slate-800" : "text-slate-400"}`}
                  >
                    {!termsAccepted
                      ? "Accept the terms above to enable upload"
                      : isDragActive
                        ? "Drop your file here"
                        : "Drag & drop or click to browse"}
                  </p>
                  <p className="text-sm text-slate-400">
                    PDF, PNG, JPG, TIFF, EPS — up to 50 MB
                  </p>
                  {uploadMutation.isPending && (
                    <div
                      className="mt-5 flex items-center justify-center gap-2"
                      style={{ color: "hsl(133, 55%, 40%)" }}
                    >
                      <div
                        className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{
                          borderColor: "#16a34a",
                          borderTopColor: "transparent",
                        }}
                      />
                      <span className="text-sm font-medium">Uploading...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 via-lime-50 to-green-50 border border-cyan-200 rounded-3xl">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-3xl flex items-center justify-center"
                      style={{ background: "hsl(133, 48%, 90%)" }}
                    >
                      <FileText
                        className="w-5 h-5"
                        style={{ color: "#15803d" }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {uploadedFile.originalName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(uploadedFile.fileSize)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-2xl hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Analyze button */}
            <div className="text-center">
              <button
                onClick={handleStartAnalysis}
                disabled={
                  !uploadedFile || analyzeMutation.isPending || !termsAccepted
                }
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, #15803d 0%, #16a34a 45%, #22c55e 100%)",
                  boxShadow:
                    uploadedFile && !analyzeMutation.isPending
                      ? "0 10px 30px rgba(236,72,153,0.28), 0 8px 20px rgba(6,182,212,0.22)"
                      : "none",
                }}
              >
                {analyzeMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mixing Colors...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Colorful Analysis
                  </>
                )}
              </button>
              {uploadedFile && (
                <p className="text-sm text-slate-400 mt-3">
                  {printerLabel} · {modeLabel} · {resolutionDPI} DPI ·{" "}
                  {pagePreset} ({widthMM}×{heightMM} mm)
                </p>
              )}
            </div>
          </div>

          {uploadedFile && (
            <div className="lg:sticky lg:top-6">
              <DocumentPreview document={uploadedFile} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
