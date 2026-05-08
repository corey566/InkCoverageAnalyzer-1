// hero-section.tsx
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  const scrollToEstimator = () => {
    const element = document.getElementById("estimator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              Built for professional print teams
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Accurate Ink Coverage Analysis for Print Shops
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Analyze printable files, estimate CMYK ink usage, and prepare
              reliable cost reports before production starts.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={scrollToEstimator}
                size="lg"
                className="h-12 rounded-full bg-emerald-700 px-7 text-sm font-bold text-white hover:bg-emerald-800"
              >
                Start Analysis
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-slate-300 px-7 text-sm font-bold text-slate-800 hover:bg-slate-50"
              >
                Learn More
              </Button>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {["CMYK Reports", "PDF and Image Support", "Cost Estimation"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-emerald-50" />
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm font-bold text-slate-950">
                    Coverage Preview
                  </p>
                  <p className="text-xs text-slate-500">
                    Sample analysis dashboard
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <FileText className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Cyan",
                    value: "28%",
                    bar: "bg-cyan-500",
                    width: "w-[28%]",
                  },
                  {
                    label: "Magenta",
                    value: "21%",
                    bar: "bg-pink-500",
                    width: "w-[21%]",
                  },
                  {
                    label: "Yellow",
                    value: "34%",
                    bar: "bg-yellow-400",
                    width: "w-[34%]",
                  },
                  {
                    label: "Black",
                    value: "18%",
                    bar: "bg-slate-800",
                    width: "w-[18%]",
                  },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">
                        {row.label}
                      </span>
                      <span className="font-bold text-slate-950">
                        {row.value}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${row.bar} ${row.width}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Estimated total
                    </p>
                    <p className="mt-1 text-2xl font-bold text-emerald-950">
                      24.6%
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                    Ready to export
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
