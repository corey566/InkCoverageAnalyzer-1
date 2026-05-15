import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Settings2,
  BarChart3,
  Calculator,
  Download,
  FileText,
  Layers,
  Printer,
  Info,
  ChevronRight,
} from "lucide-react";

const steps = [
  {
    step: 1,
    icon: <Settings2 className="h-5 w-5 text-white" />,
    title: "Choose Analysis Mode",
    description:
      "Select either CMYK Mode or Color + Black mode before uploading.",
    detail:
      "CMYK Mode separates ink into four channels: Cyan, Magenta, Yellow, and Black — ideal for professional four-colour offset or laser printers. Color + Black Mode combines CMY channels into a single 'Color' average, matching how standard desktop inkjet printers work.",
  },
  {
    step: 2,
    icon: <Upload className="h-5 w-5 text-white" />,
    title: "Upload Your Document",
    description: "Drag and drop, or click to browse and select your file.",
    detail:
      "Supported formats: PDF (multi-page), PNG, JPG/JPEG, TIFF, EPS. Maximum file size: 50MB. PDF files are analysed using Ghostscript's INKCOV device which provides true CMYK ink coverage per page.",
  },
  {
    step: 3,
    icon: <FileText className="h-5 w-5 text-white" />,
    title: "Preview Your Document",
    description: "After uploading, see a live preview of your document.",
    detail:
      "PDFs are rendered in an interactive viewer. Images are displayed with zoom controls (50%–200%). Click 'Open' to view the file in a new browser tab.",
  },
  {
    step: 4,
    icon: <BarChart3 className="h-5 w-5 text-white" />,
    title: "Start Analysis",
    description: "Click 'Analyze Ink Coverage' to start the CMYK analysis.",
    detail:
      "Analysis typically completes in 5–60 seconds depending on file size and number of pages. Results update automatically once complete — you do not need to refresh the page.",
  },
  {
    step: 5,
    icon: <Calculator className="h-5 w-5 text-white" />,
    title: "Review Coverage Results",
    description: "See overall ink coverage and a page-by-page breakdown.",
    detail:
      "The Overall Ink Coverage card shows average CMYK percentages across all pages. The Page-by-Page Breakdown table shows per-page values. For documents with more than 5 pages, click 'Show all pages' to expand the table.",
  },
  {
    step: 6,
    icon: <Calculator className="h-5 w-5 text-white" />,
    title: "Calculate Cost Per Page",
    description: "Enter your cartridge yield and price to get cost estimates.",
    detail:
      "For each cartridge, enter the rated page yield (at 5% coverage) and your purchase price. Adjust the Waste/Variation Factor to account for cleaning cycles and printer waste (default 10%).",
  },
  {
    step: 7,
    icon: <Download className="h-5 w-5 text-white" />,
    title: "Export PDF Report",
    description:
      "Download a professional PDF report of your analysis and cost results.",
    detail:
      "Click 'Export PDF Report' to generate and download a formatted PDF including the SCTD branding, contact information, overall coverage summary, page-by-page breakdown table, and cost estimation results.",
  },
];

const faqs = [
  {
    q: "What does 5% page coverage mean?",
    a: "Cartridge manufacturers rate yield based on a test page where ink covers exactly 5% of the page area — roughly the amount of ink on a standard business letter. Most real documents use more than 5% coverage, which means your effective yield will be lower than the rated yield.",
  },
  {
    q: "How is the effective yield calculated?",
    a: "Effective Yield = Rated Yield × (5% ÷ Actual Coverage%). For example, if your cartridge is rated at 1,000 pages at 5% coverage but your document uses 20% coverage, the effective yield is 1,000 × (5/20) = 250 pages.",
  },
  {
    q: "What is the Waste / Variation Factor?",
    a: "This accounts for real-world losses: printhead cleaning cycles, residual ink in 'empty' cartridges, calibration prints, and other non-productive ink usage. A 10% waste factor is typical for inkjet printers; laser printers may be 3–6%.",
  },
  {
    q: "Why is there a ±8% range in cost results?",
    a: "Environmental factors — temperature, humidity, paper type, and printer age — all affect actual ink consumption. The ±8% range gives you a realistic cost window rather than implying false precision.",
  },
  {
    q: "Is my document stored on your servers?",
    a: "No. Documents are processed in a temporary directory and are not retained after analysis completes. No document content, personal information, or usage data is stored. See our Privacy Policy for full details.",
  },
  {
    q: "Why do image files sometimes give different results from PDFs?",
    a: "PDF files are analysed using Ghostscript's native PDF rendering with the INKCOV device, which is very accurate. Image files (PNG, JPG) are analysed by converting the RGB image to CMYK colour space using ImageMagick. The RGB-to-CMYK conversion can introduce minor differences.",
  },
];

export default function Documentation() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative overflow-hidden text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #06180c 0%, #092e17 48%, #051108 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center md:py-24">
          <div className="mb-4 flex items-center justify-center gap-2 text-sm font-bold text-green-300/80">
            <span>Home</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/70">Documentation</span>
          </div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300 backdrop-blur">
            <FileText className="h-4 w-4" />
            Documentation
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
            How to Use the Estimator
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-green-50/75">
            A step-by-step guide to getting accurate ink coverage analysis and
            cost estimates from your documents.
          </p>
        </div>
      </section>

      <section
        className="relative overflow-hidden py-20"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 42%, #ecfeff 100%)",
        }}
      >
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-4xl space-y-16 px-6">
          <div>
            <p className="mb-2 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
              Guide
            </p>
            <h2 className="mb-8 text-2xl font-black text-slate-950">
              Step-by-Step
            </h2>

            <div className="space-y-4">
              {steps.map((s) => (
                <div
                  key={s.step}
                  className="rounded-[1.75rem] border border-white/80 bg-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-green-200 hover:bg-green-50/60"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-lime-400 shadow-lg shadow-green-100">
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <Badge className="rounded-xl bg-green-100 text-xs font-bold text-green-700">
                          Step {s.step}
                        </Badge>
                        <h3 className="text-sm font-black text-slate-950">
                          {s.title}
                        </h3>
                      </div>
                      <p className="mb-2 text-sm font-bold text-slate-700">
                        {s.description}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
              Modes
            </p>
            <h2 className="mb-6 text-2xl font-black text-slate-950">
              Analysis Modes Explained
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-green-200 bg-gradient-to-br from-green-50 to-lime-50 p-6 shadow-lg shadow-green-100/40">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-600">
                    <Layers className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-black text-green-950">CMYK Mode</h3>
                </div>
                <div className="space-y-2 text-sm text-green-900/80">
                  <p>
                    Analyses each colour channel separately: Cyan, Magenta,
                    Yellow, and Black.
                  </p>
                  <p>
                    Best for: professional four-colour printing, offset presses,
                    laser printers with separate CMYK toner cartridges.
                  </p>
                  <p>
                    Output: four separate cost estimates — one per cartridge.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/80 bg-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800">
                    <Printer className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-black text-slate-950">
                    Color + Black Mode
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    Combines Cyan, Magenta, and Yellow into a single "Color"
                    average. Black remains separate.
                  </p>
                  <p>
                    Best for: desktop inkjet printers that use a single
                    tri-colour cartridge plus a black cartridge.
                  </p>
                  <p>
                    Output: two cost estimates — color cartridge and black
                    cartridge.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
              FAQ
            </p>
            <h2 className="mb-6 text-2xl font-black text-slate-950">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-[1.5rem] border border-white/80 bg-white/75 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-green-100">
                      <Info className="h-4 w-4 text-green-700" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-black text-slate-950">
                        {faq.q}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
