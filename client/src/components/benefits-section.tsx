import {
  TrendingUp,
  DollarSign,
  File,
  Zap,
  Download,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function BenefitsSection() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Boost Productivity",
      description:
        "Streamline your printing workflow with instant ink coverage analysis. No more guesswork or manual calculations.",
      accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      icon: DollarSign,
      title: "Cost Optimization",
      description:
        "Accurately estimate ink costs before printing. Optimize pricing and reduce waste with precise calculations.",
      accent: "bg-cyan-50 text-cyan-700 border-cyan-100",
    },
    {
      icon: File,
      title: "Multiple Formats",
      description:
        "Support for PDF, EPS, Excel, images, and printable document formats. One tool for everyday production needs.",
      accent: "bg-slate-50 text-slate-700 border-slate-200",
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description:
        "Advanced processing analyzes documents quickly, helping teams get coverage results without delays.",
      accent: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      icon: Download,
      title: "Detailed Reports",
      description:
        "Export clear PDF and CSV reports for client presentations, quotes, internal reviews, and cost analysis.",
      accent: "bg-gray-100 text-gray-800 border-gray-200",
    },
    {
      icon: Shield,
      title: "Enterprise Ready",
      description:
        "Built for professional use with secure file handling, reliable performance, and practical reporting workflows.",
      accent: "bg-green-50 text-green-700 border-green-100",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Professional Benefits
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Why Choose Our Ink Coverage Estimator?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Designed for print professionals who need accurate, reliable ink
            usage calculations without a complicated workflow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              className="group h-full rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardContent className="flex h-full flex-col p-6">
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border ${benefit.accent}`}
                >
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">
                  {benefit.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {benefit.description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-700 opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
