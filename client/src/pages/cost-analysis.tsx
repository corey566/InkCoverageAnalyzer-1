import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  BarChart3,
  ShieldCheck,
  DollarSign,
  Zap,
  ChevronRight,
} from "lucide-react";

const platforms = [
  {
    name: "SCTD Ink Coverage Estimator",
    highlight: true,
    badge: "Recommended",
    badgeColor: "bg-green-500 text-white",
    accuracy: "★★★★★",
    cost: "Free",
    method: "Ghostscript CMYK analysis",
    features: [
      { label: "CMYK channel analysis", yes: true },
      { label: "Color + Black mode", yes: true },
      { label: "Page-by-page breakdown", yes: true },
      { label: "Cost per page estimate", yes: true },
      { label: "Waste / variation factor", yes: true },
      { label: "PDF & image support", yes: true },
      { label: "No data retained", yes: true },
      { label: "No account required", yes: true },
    ],
    notes:
      "Uses professional-grade Ghostscript INKCOV engine — the same technology used by prepress professionals worldwide. Provides separate CMYK percentages per page with full cost modelling. Completely free with no data retention.",
  },
  {
    name: "Printix",
    highlight: false,
    badge: "Subscription",
    badgeColor: "bg-slate-100 text-slate-700",
    accuracy: "★★★★☆",
    cost: "$15–$40/mo",
    method: "Device-based tracking",
    features: [
      { label: "CMYK channel analysis", yes: false },
      { label: "Color + Black mode", yes: true },
      { label: "Page-by-page breakdown", yes: false },
      { label: "Cost per page estimate", yes: true },
      { label: "Waste / variation factor", yes: false },
      { label: "PDF & image support", yes: false },
      { label: "No data retained", yes: false },
      { label: "No account required", yes: false },
    ],
    notes:
      "Cloud-based print management primarily focused on tracking print jobs across networked printers. Requires software installation and a subscription. Does not perform pre-print ink coverage analysis.",
  },
  {
    name: "PaperCut MF",
    highlight: false,
    badge: "Enterprise",
    badgeColor: "bg-slate-100 text-slate-700",
    accuracy: "★★★☆☆",
    cost: "$1,500+ one-time",
    method: "Job cost tracking",
    features: [
      { label: "CMYK channel analysis", yes: false },
      { label: "Color + Black mode", yes: true },
      { label: "Page-by-page breakdown", yes: false },
      { label: "Cost per page estimate", yes: true },
      { label: "Waste / variation factor", yes: false },
      { label: "PDF & image support", yes: false },
      { label: "No data retained", yes: false },
      { label: "No account required", yes: false },
    ],
    notes:
      "Comprehensive enterprise print management solution. Focuses on cost allocation, user quotas, and secure printing. Does not provide pre-print ink coverage estimation.",
  },
  {
    name: "Ink Coverage Calculator (online)",
    highlight: false,
    badge: "Free / Limited",
    badgeColor: "bg-slate-100 text-slate-700",
    accuracy: "★★☆☆☆",
    cost: "Free (basic)",
    method: "RGB pixel sampling",
    features: [
      { label: "CMYK channel analysis", yes: false },
      { label: "Color + Black mode", yes: false },
      { label: "Page-by-page breakdown", yes: false },
      { label: "Cost per page estimate", yes: false },
      { label: "Waste / variation factor", yes: false },
      { label: "PDF & image support", yes: false },
      { label: "No data retained", yes: true },
      { label: "No account required", yes: true },
    ],
    notes:
      "Generic online tools typically rely on simple RGB pixel sampling, which is inaccurate for professional CMYK print estimation. Limited to single images, cannot handle multi-page PDFs.",
  },
  {
    name: "Prepress Calc Tools",
    highlight: false,
    badge: "Professional",
    badgeColor: "bg-slate-100 text-slate-700",
    accuracy: "★★★★☆",
    cost: "$200–$500/mo",
    method: "RIP-based analysis",
    features: [
      { label: "CMYK channel analysis", yes: true },
      { label: "Color + Black mode", yes: true },
      { label: "Page-by-page breakdown", yes: true },
      { label: "Cost per page estimate", yes: true },
      { label: "Waste / variation factor", yes: false },
      { label: "PDF & image support", yes: true },
      { label: "No data retained", yes: false },
      { label: "No account required", yes: false },
    ],
    notes:
      "Professional RIP tools provide accurate CMYK analysis but are expensive and complex. Primarily designed for large commercial printers, not small-to-medium print shops.",
  },
];

const benefits = [
  {
    icon: <Zap className="h-6 w-6 text-green-700" />,
    title: "Powered by Ghostscript",
    description:
      "Uses the industry-standard Ghostscript INKCOV device for accurate CMYK measurement — the same engine used in professional prepress workflows.",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-green-700" />,
    title: "Full CMYK Breakdown",
    description:
      "Unlike generic tools, we provide separate Cyan, Magenta, Yellow, and Black coverage per page — essential for accurate cost modelling.",
  },
  {
    icon: <DollarSign className="h-6 w-6 text-green-700" />,
    title: "Completely Free",
    description:
      "No subscription, no credits, no limits. The SCTD estimator is free for all users — individuals, small businesses, and enterprises alike.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-green-700" />,
    title: "No Data Retained",
    description:
      "Your documents are processed and immediately discarded. We retain no user data, no document content, and no personal information.",
  },
];

export default function CostAnalysis() {
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
            <span className="text-white/70">Cost Analysis</span>
          </div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300 backdrop-blur">
            <BarChart3 className="h-4 w-4" />
            Platform Comparison
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
            Cost Analysis Tools
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-green-50/75">
            See how the SCTD Ink Coverage Estimator compares to other platforms
            in accuracy, features, and value.
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

        <div className="relative mx-auto max-w-6xl space-y-20 px-6">
          <div>
            <div className="mb-12 text-center">
              <p className="mb-3 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
                Our Advantage
              </p>
              <h2 className="mb-3 text-2xl font-black text-slate-950 md:text-3xl">
                Why Choose SCTD?
              </h2>
              <p className="mx-auto max-w-xl text-slate-600">
                Most online ink estimators use basic pixel-counting methods. We
                use the same technology trusted by commercial print shops for
                decades.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="group rounded-[1.75rem] border border-white/70 bg-white/75 p-6 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-green-200 hover:bg-green-50/70"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-lime-50 shadow-inner">
                    {b.icon}
                  </div>
                  <h3 className="mb-2 text-sm font-black text-slate-950">
                    {b.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-8 text-2xl font-black text-slate-950">
              Platform Comparison
            </h2>

            <div className="space-y-5">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className={`rounded-[2rem] border p-6 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 ${
                    platform.highlight
                      ? "border-green-300 bg-green-50/80 shadow-[0_24px_60px_rgba(22,163,74,0.18)]"
                      : "border-white/70 bg-white/75 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
                  }`}
                >
                  <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-black text-slate-950">
                          {platform.name}
                        </h3>
                        <Badge className={`rounded-xl ${platform.badgeColor}`}>
                          {platform.badge}
                        </Badge>
                        {platform.highlight && (
                          <Badge className="rounded-xl bg-green-700 text-white">
                            Best Value
                          </Badge>
                        )}
                      </div>

                      <div className="mb-3 flex flex-wrap gap-3 text-sm text-slate-600">
                        <span className="rounded-2xl bg-white/70 px-3 py-1">
                          <strong>Accuracy:</strong> {platform.accuracy}
                        </span>
                        <span className="rounded-2xl bg-white/70 px-3 py-1">
                          <strong>Cost:</strong> {platform.cost}
                        </span>
                        <span className="rounded-2xl bg-white/70 px-3 py-1">
                          <strong>Method:</strong> {platform.method}
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed text-slate-600">
                        {platform.notes}
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:w-80">
                      {platform.features.map((f) => (
                        <div
                          key={f.label}
                          className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 p-3 text-xs"
                        >
                          {f.yes ? (
                            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-600" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-slate-300" />
                          )}
                          <span
                            className={
                              f.yes ? "text-slate-800" : "text-slate-400"
                            }
                          >
                            {f.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-green-200 bg-gradient-to-br from-green-50 to-lime-50 p-6 shadow-lg shadow-green-100/50">
            <h3 className="mb-2 text-lg font-black text-green-950">
              A Note on Accuracy
            </h3>
            <p className="text-sm leading-relaxed text-green-900/80">
              Ink coverage estimation is inherently approximate. Real-world
              print costs vary based on environmental conditions, paper type,
              print speed, and printer maintenance status. The SCTD estimator
              adds a configurable waste/variation factor (default 10%) and
              provides a ±8% range to give you a realistic cost window rather
              than a false sense of precision.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
