import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { AnalysisResults } from "@/components/analysis-results";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  ArrowRight, FileText, BarChart3, Calculator,
  Download, ShieldCheck, ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import type { AnalysisSettings } from "@shared/schema";

const features = [
  {
    icon: <FileText className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Upload Any Document",
    desc: "PDF, PNG, JPG, TIFF, and EPS files up to 50 MB. Multi-page PDFs are fully supported with per-page reporting.",
    href: "/documentation",
  },
  {
    icon: <BarChart3 className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "CMYK Coverage Analysis",
    desc: "Professional-grade Ghostscript analysis gives you per-channel ink coverage on every page of your document.",
    href: "/documentation",
  },
  {
    icon: <Calculator className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Cost Per Page Estimate",
    desc: "Enter your cartridge yield and price to get an accurate cost estimate with a configurable waste factor.",
    href: "/cost-analysis",
  },
  {
    icon: <Download className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Export PDF Report",
    desc: "Download a branded PDF report with full coverage breakdown and cost analysis to share with clients.",
    href: "/documentation",
  },
  {
    icon: <ShieldCheck className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "No Data Retained",
    desc: "Your documents are processed in memory and immediately deleted. Nothing is stored on our servers.",
    href: "/privacy-policy",
  },
  {
    icon: <FileText className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Page-by-Page Breakdown",
    desc: "See individual ink coverage for every page in your document — not just a document average.",
    href: "/documentation",
  },
];

const stats = [
  { value: "PDF, PNG, JPG", label: "File formats" },
  { value: "50 MB", label: "Max file size" },
  { value: "CMYK", label: "Channel analysis" },
  { value: "Free", label: "Always" },
];

export default function Home() {
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [settings, setSettings] = useState<AnalysisSettings | null>(null);

  const handleAnalysisStart = (id: number, used: AnalysisSettings) => {
    setSettings(used);
    setAnalysisId(id);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden text-white">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0a2010 0%, #0d2d18 55%, #112b14 100%)" }}
        />
        {/* Decorative dot grid top-right */}
        <div
          className="absolute top-0 right-0 w-96 h-96 dot-pattern pointer-events-none"
          style={{ opacity: 0.35 }}
        />
        {/* Decorative dot grid bottom-left */}
        <div
          className="absolute bottom-0 left-0 w-72 h-72 dot-pattern pointer-events-none"
          style={{ opacity: 0.20 }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-green-300/80 mb-6 font-medium">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Print Cost Analysis</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Know Your Print
              <br />
              <span style={{ color: "hsl(133, 65%, 52%)" }}>Cost Per Page</span>
              <br />
              Before You Print
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              Upload any document and get accurate CMYK ink coverage analysis with real cost estimation — powered by professional-grade Ghostscript technology.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <a href="#estimator">
                <button className="btn-primary text-base px-8 py-3.5">
                  Start Free Analysis <ArrowRight className="w-4 h-4" />
                </button>
              </a>
              <Link href="/documentation">
                <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm border border-white/25 text-white hover:bg-white/10 transition-all">
                  How It Works
                </button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
                  <div className="text-sm text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features / Services ── */}
      <section className="bg-white py-24 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-14">
            <p className="section-label mb-3">Featured Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A wide range of professional<br className="hidden md:block" /> print analysis services
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed">
              Built for print shops, marketing agencies, and businesses who need reliable ink coverage data before committing to a print run.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link key={f.title} href={f.href}>
                <div className="service-card group cursor-pointer h-full">
                  {/* Icon */}
                  <div className="icon-box">{f.icon}</div>

                  {/* Content */}
                  <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">{f.desc}</p>

                  {/* Arrow link */}
                  <div
                    className="flex items-center gap-1.5 text-sm font-semibold group-hover:gap-3 transition-all"
                    style={{ color: "hsl(133, 48%, 36%)" }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Estimator Tool ── */}
      <section className="py-4" style={{ background: "hsl(120, 8%, 97%)" }}>
        <FileUpload onAnalysisStart={handleAnalysisStart} />
        <AnalysisResults analysisId={analysisId} settings={settings} />
      </section>

      <Footer />
    </div>
  );
}
