// hero-section.tsx
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  Upload,
  Calculator,
  Droplets,
} from "lucide-react";

export function HeroSection() {
  const scrollToEstimator = () => {
    const element = document.getElementById("estimator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden py-12 md:py-16"
      style={{
        background:
          "radial-gradient(circle at 8% 8%, rgba(34,197,94,0.22) 0, transparent 26%), radial-gradient(circle at 92% 12%, rgba(125,211,252,0.26) 0, transparent 28%), radial-gradient(circle at 50% 0%, rgba(250,204,21,0.18) 0, transparent 30%), linear-gradient(135deg, #f0fdf4 0%, #ecfeff 38%, #f7fee7 70%, #ffffff 100%)",
      }}
    >
      <div className="pointer-events-none absolute -top-16 -left-16 h-52 w-52 rounded-full bg-green-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-48 rounded-full bg-lime-200/40 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.28]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(22,163,74,0.20) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center justify-center rounded-full border border-white bg-gradient-to-r from-green-100 via-lime-100 to-cyan-100 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
            <Sparkles className="mr-2 h-4 w-4 text-green-600" />
            Friendly Print Helper
          </p>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Ink &amp; Toner Coverage Estimator{" "}
            <span className="inline-block text-green-600">✅</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600 md:text-lg">
            Choose your print setup step-by-step, upload your file, and get a
            clear ink coverage estimate without the complicated feeling.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={scrollToEstimator}
              size="lg"
              className="h-12 rounded-full bg-gradient-to-r from-green-600 via-green-500 to-lime-400 px-7 text-sm font-black text-white shadow-xl shadow-green-200 transition-all hover:-translate-y-0.5 hover:from-green-500 hover:via-green-400 hover:to-lime-300"
            >
              Start Free Analysis
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={scrollToEstimator}
              className="h-12 rounded-full border-2 border-green-200 bg-white/75 px-7 text-sm font-black text-green-700 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-50"
            >
              How It Works
            </Button>
          </div>
        </div>

        <div
          className="mx-auto max-w-4xl rounded-[2.25rem] border-2 border-white bg-white/85 p-5 shadow-2xl backdrop-blur md:p-6"
          style={{
            boxShadow:
              "0 24px 80px rgba(34,197,94,0.16), 0 14px 40px rgba(14,165,233,0.10), 0 8px 24px rgba(15,23,42,0.06)",
          }}
        >
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                icon: FileText,
                title: "PDF, PNG, JPG",
                sub: "File formats",
                bg: "from-green-50 to-lime-50",
              },
              {
                icon: Upload,
                title: "50 MB",
                sub: "Max file size",
                bg: "from-cyan-50 to-green-50",
              },
              {
                icon: Droplets,
                title: "CMYK",
                sub: "Channel analysis",
                bg: "from-lime-50 to-yellow-50",
              },
              {
                icon: Calculator,
                title: "Free",
                sub: "Always",
                bg: "from-green-50 to-cyan-50",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`rounded-3xl border-2 border-white bg-gradient-to-br ${item.bg} p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-green-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-black leading-tight text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {item.sub}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-3xl border-2 border-green-200 bg-gradient-to-r from-green-50 via-lime-50 to-cyan-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-green-900">
                    Simple, guided, and ready for print teams
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Select printer type, print mode, page size, DPI, then upload
                    your document for instant analysis.
                  </p>
                </div>
              </div>

              <button
                onClick={scrollToEstimator}
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-black text-green-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-green-50"
              >
                Go to estimator
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
