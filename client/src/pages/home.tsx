import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { AnalysisResults } from "@/components/analysis-results";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  ArrowRight,
  FileText,
  BarChart3,
  Calculator,
  Download,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "wouter";
import type { AnalysisSettings } from "@shared/schema";

const features = [
  {
    icon: (
      <FileText className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />
    ),
    title: "Upload Any Document",
    desc: "PDF, PNG, JPG, TIFF, and EPS files up to 50 MB. Multi-page PDFs are fully supported with per-page reporting.",
    href: "/documentation",
  },
  {
    icon: (
      <BarChart3 className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />
    ),
    title: "CMYK Coverage Analysis",
    desc: "Professional-grade Ghostscript analysis gives you per-channel ink coverage on every page of your document.",
    href: "/documentation",
  },
  {
    icon: (
      <Calculator className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />
    ),
    title: "Cost Per Page Estimate",
    desc: "Enter your cartridge yield and price to get an accurate cost estimate with a configurable waste factor.",
    href: "/cost-analysis",
  },
  {
    icon: (
      <Download className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />
    ),
    title: "Export PDF Report",
    desc: "Download a branded PDF report with full coverage breakdown and cost analysis to share with clients.",
    href: "/documentation",
  },
  {
    icon: (
      <ShieldCheck
        className="w-7 h-7"
        style={{ color: "hsl(133, 48%, 36%)" }}
      />
    ),
    title: "No Data Retained",
    desc: "Your documents are processed in memory and immediately deleted. Nothing is stored on our servers.",
    href: "/privacy-policy",
  },
  {
    icon: (
      <FileText className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />
    ),
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
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  };

  const scrollToEstimator = () => {
    document.getElementById("estimator")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, #06180c 0%, #092e17 48%, #051108 100%)",
        }}
      >
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
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-16 lg:px-8 lg:py-20 xl:py-24">
          <div className="grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
            {/* Left content */}
            <div className="relative z-20 max-w-3xl">
              <div className="mb-4 hidden items-center gap-2 text-sm font-bold text-green-300/90 sm:flex">
                <span>Home</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-white/70">Print Cost Analysis</span>
              </div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-green-300 backdrop-blur sm:text-xs">
                <CheckCircle2 className="h-4 w-4" />
                Friendly print cost helper
              </div>

              <h1 className="max-w-3xl text-[2.55rem] font-black leading-[0.96] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Know Your Print
                <br />
                <span className="text-green-400">Cost Per Page</span>
                <br />
                Before You Print
              </h1>

              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/82 md:text-lg">
                Upload any document and get accurate CMYK ink coverage analysis
                with real cost estimation — powered by professional-grade
                Ghostscript technology.
              </p>

              <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
                <button
                  onClick={scrollToEstimator}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-600 via-green-500 to-lime-400 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-green-950/30 transition-all hover:-translate-y-0.5 hover:from-green-500 hover:via-green-400 hover:to-lime-300"
                >
                  Start Free Analysis <ArrowRight className="h-4 w-4" />
                </button>

                <Link href="/documentation">
                  <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/10 min-[420px]:w-auto">
                    How It Works
                  </button>
                </Link>
              </div>

              <div className="mt-8 grid max-w-2xl grid-cols-4 gap-2 sm:gap-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/[0.09] sm:rounded-3xl sm:p-4"
                  >
                    <div className="text-[11px] font-black leading-tight text-white sm:text-base md:text-lg">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[9px] font-medium leading-tight text-white/55 sm:text-xs">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Character image */}
            <div className="relative z-10 -mt-2 min-h-[310px] sm:min-h-[430px] md:min-h-[520px] lg:-mt-0 lg:min-h-[620px] xl:min-h-[700px]">
              <div className="absolute left-1/2 top-1/2 h-[88%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-green-400/25 via-yellow-300/15 to-transparent blur-2xl" />

              <div className="absolute right-0 top-4 hidden rounded-3xl border border-green-300/20 bg-black/20 px-5 py-4 shadow-2xl backdrop-blur md:block">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-green-300">
                  Save Cost
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  Accurate print estimates
                </p>
              </div>

              <div className="absolute left-0 top-24 hidden rounded-3xl border border-yellow-300/20 bg-black/20 px-5 py-4 shadow-2xl backdrop-blur lg:block">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                  Save Money
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  Know before printing
                </p>
              </div>

              <div className="absolute bottom-10 left-4 hidden rounded-3xl border border-green-300/20 bg-black/20 px-5 py-4 shadow-2xl backdrop-blur md:block">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-green-300">
                  Get Accurate Results
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  CMYK + cost report
                </p>
              </div>

              <img
                src="/hero-img.png"
                alt="AI Man print cost helper holding ink cartridges and paper"
                className="relative z-10 mx-auto h-auto w-[126%] max-w-none -translate-x-[8%] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)] sm:w-[112%] sm:-translate-x-[4%] md:w-[104%] md:translate-x-0 lg:absolute lg:bottom-[-92px] lg:right-[-145px] lg:w-[118%] xl:bottom-[-115px] xl:right-[-185px] xl:w-[126%] 2xl:right-[-220px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features / Services ── */}
      <section
        className="relative overflow-hidden py-20 border-y border-white/60"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 42%, #ecfeff 100%)",
        }}
      >
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="inline-flex items-center justify-center rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm backdrop-blur mb-4">
              Featured Services
            </p>

            <h2 className="text-3xl md:text-4xl font-black text-slate-950 mb-4">
              A wide range of professional
              <br className="hidden md:block" /> print analysis services
            </h2>

            <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
              Built for print shops, marketing agencies, and businesses who need
              reliable ink coverage data before committing to a print run.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Link key={f.title} href={f.href}>
                <div className="group h-full cursor-pointer rounded-[1.75rem] border border-white/80 bg-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-green-200 hover:bg-green-50/70 hover:shadow-[0_24px_60px_rgba(22,163,74,0.16)]">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-lime-50 shadow-inner">
                    {f.icon}
                  </div>

                  <h3 className="text-base font-black text-slate-950 mb-2">
                    {f.title}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    {f.desc}
                  </p>

                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-black text-green-700 shadow-sm transition-all group-hover:gap-3 group-hover:bg-green-600 group-hover:text-white">
                    Learn more
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
