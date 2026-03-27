import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { AnalysisResults } from "@/components/analysis-results";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArrowRight, FileText, BarChart3, Calculator, Download, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: <FileText className="w-6 h-6 text-green-700" />,
    title: "Upload Any Document",
    desc: "PDF, PNG, JPG, TIFF, and EPS files up to 50MB. Multi-page PDFs are fully supported.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-green-700" />,
    title: "CMYK Coverage Analysis",
    desc: "Professional-grade Ghostscript analysis gives you per-channel ink coverage on every page.",
  },
  {
    icon: <Calculator className="w-6 h-6 text-green-700" />,
    title: "Cost Per Page Estimate",
    desc: "Enter your cartridge yield and price to get an accurate cost estimate with a waste factor adjustment.",
  },
  {
    icon: <Download className="w-6 h-6 text-green-700" />,
    title: "Export PDF Report",
    desc: "Download a branded PDF report with full coverage breakdown and cost analysis to share with clients.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-green-700" />,
    title: "No Data Retained",
    desc: "Your documents are processed in memory and immediately deleted. Nothing is stored on our servers.",
  },
  {
    icon: <FileText className="w-6 h-6 text-green-700" />,
    title: "Page-by-Page Breakdown",
    desc: "See individual ink coverage for every page in your document — not just an average.",
  },
];

export default function Home() {
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [mode, setMode] = useState<"cmyk" | "color_black">("cmyk");

  const handleAnalysisStart = (id: number, selectedMode: "cmyk" | "color_black") => {
    setMode(selectedMode);
    setAnalysisId(id);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />

      {/* Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg, #0d2137 0%, #0f2e4a 50%, #0a3020 100%)" }}
      >
        {/* Decorative dots */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="absolute bottom-0 left-0 w-64 h-64 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-sm text-green-300 font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Professional Print Cost Analysis Tool
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Know Your Print
              <br />
              <span className="text-green-400">Cost Per Page</span>
              <br />
              Before You Print
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              Upload any document and get accurate CMYK ink coverage analysis with real cost estimation — powered by professional-grade Ghostscript technology.
            </p>

            <div className="flex flex-wrap gap-4 mb-14">
              <a href="#estimator">
                <button className="btn-primary text-base px-8 py-3.5">
                  Start Free Analysis <ArrowRight className="w-4 h-4" />
                </button>
              </a>
              <Link href="/documentation">
                <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm border border-white/20 text-white hover:bg-white/10 transition-all">
                  How It Works
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { stat: "PDF, PNG, JPG", label: "File formats" },
                { stat: "50 MB", label: "Max file size" },
                { stat: "CMYK", label: "Channel analysis" },
                { stat: "Free", label: "Always" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white mb-0.5">{s.stat}</div>
                  <div className="text-sm text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label mb-3">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for accurate<br className="hidden md:block" /> print cost analysis
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Built for print shops, marketing agencies, and businesses who need reliable ink coverage data before committing to a print run.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-pro group">
                <div className="icon-box mb-5">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{f.desc}</p>
                <div className="flex items-center gap-1 text-green-700 text-sm font-semibold group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estimator */}
      <FileUpload onAnalysisStart={handleAnalysisStart} />
      <AnalysisResults analysisId={analysisId} mode={mode} />

      <Footer />
    </div>
  );
}
