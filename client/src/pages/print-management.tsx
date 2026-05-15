import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Droplets,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
} from "lucide-react";

const brands = [
  {
    name: "HP (Hewlett-Packard)",
    type: "Inkjet & Laser",
    costPerPage: "$0.04–$0.12",
    cartridgeYield: "1,000–8,000 pages",
    wasteFactor: "8–12%",
    inkTech: "Thermal inkjet / Laser toner",
    wasteNotes:
      "HP printers perform regular printhead cleaning cycles which consume significant ink even when idle. Ink evaporation during priming adds another 5–8% waste.",
    accent: "border-blue-300",
  },
  {
    name: "Epson",
    type: "Inkjet (EcoTank)",
    costPerPage: "$0.01–$0.09",
    cartridgeYield: "6,000–14,000 pages",
    wasteFactor: "3–7%",
    inkTech: "Piezoelectric inkjet",
    wasteNotes:
      "EcoTank models dramatically reduce waste by using refillable tanks. Piezoelectric technology does not heat ink, reducing evaporation. Periodic nozzle checks consume minimal ink.",
    accent: "border-green-300",
  },
  {
    name: "Canon",
    type: "Inkjet & Laser",
    costPerPage: "$0.05–$0.14",
    cartridgeYield: "400–10,000 pages",
    wasteFactor: "7–11%",
    inkTech: "Thermal inkjet / Electrophotographic",
    wasteNotes:
      "Canon inkjet models use Printhead Cleaning System (PCS) which can consume 1–2 ml per cycle. Deep cleaning for clogs is especially wasteful. PIXMA printers have maintenance cartridges that fill with waste ink.",
    accent: "border-red-300",
  },
  {
    name: "Brother",
    type: "Laser & Inkjet",
    costPerPage: "$0.02–$0.08",
    cartridgeYield: "1,500–12,000 pages",
    wasteFactor: "5–9%",
    inkTech: "Laser toner / Piezoelectric inkjet",
    wasteNotes:
      "Brother laser printers generate toner waste collected in a waste toner box. Drum units require replacement separately. Inkjet models have fewer cleaning cycles than HP/Canon, reducing waste ink.",
    accent: "border-yellow-300",
  },
  {
    name: "Xerox",
    type: "Laser / Enterprise",
    costPerPage: "$0.01–$0.06",
    cartridgeYield: "5,000–30,000 pages",
    wasteFactor: "3–6%",
    inkTech: "Electrophotographic laser",
    wasteNotes:
      "Xerox enterprise printers are optimised for high-volume output. Waste toner is collected efficiently, and some models offer waste-free toner cartridges. Yield consistency is very high across large print runs.",
    accent: "border-purple-300",
  },
  {
    name: "Kyocera",
    type: "Laser / Enterprise",
    costPerPage: "$0.008–$0.04",
    cartridgeYield: "8,000–40,000 pages",
    wasteFactor: "2–4%",
    inkTech: "Ecosys laser technology",
    wasteNotes:
      "Kyocera's ECOSYS technology uses long-life drums separate from toner cartridges, significantly reducing consumable waste. Among the lowest waste factors in the industry. Ideal for high-volume environments.",
    accent: "border-indigo-300",
  },
];

const wasteTypes = [
  {
    icon: <Droplets className="w-5 h-5 text-green-700" />,
    title: "Printhead Cleaning Cycles",
    description:
      "Inkjet printers purge ink through the printhead nozzles to prevent clogging, especially after periods of inactivity. This can consume 5–15% of a cartridge's total ink.",
  },
  {
    icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    title: "Ink Left in Empty Cartridges",
    description:
      "Manufacturers set 'empty' thresholds before cartridges are actually depleted to protect the printhead. Up to 20–30% of ink can remain in a 'dead' cartridge.",
  },
  {
    icon: <TrendingDown className="w-5 h-5 text-red-500" />,
    title: "Ink Evaporation",
    description:
      "Thermal inkjet printers heat ink repeatedly, causing evaporation over time — particularly in printers that are left idle for extended periods.",
  },
  {
    icon: <Printer className="w-5 h-5 text-slate-600" />,
    title: "Test Pages & Calibration",
    description:
      "Every printer prints alignment sheets, nozzle checks, and calibration patterns during setup and maintenance. These consume ink and paper without productive output.",
  },
  {
    icon: <Info className="w-5 h-5 text-purple-500" />,
    title: "Toner Waste Boxes",
    description:
      "Laser printers collect waste toner in a separate box. This toner — from cleaning the drum between jobs — represents 3–6% of total toner consumption.",
  },
];

export default function PrintManagement() {
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
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center md:py-24">
          <div className="mb-4 flex items-center justify-center gap-2 text-sm font-bold text-green-300/80">
            <span>Home</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/70">Print Management</span>
          </div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300 backdrop-blur">
            <Printer className="h-4 w-4" />
            Print Management Guide
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
            Printer Management
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-green-50/75">
            Understand how different printers consume ink, where waste comes
            from, and how to choose the right printer for your print volume and
            budget.
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

        <div className="relative mx-auto max-w-5xl space-y-20 px-6">
          <div>
            <div className="mb-10">
              <p className="mb-2 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
                Understanding Waste
              </p>
              <h2 className="mb-3 text-2xl font-black text-slate-950">
                Where Does Ink Waste Come From?
              </h2>
              <p className="max-w-2xl text-slate-600">
                Printer manufacturers rate cartridge yield at 5% page coverage.
                In real-world use, waste from cleaning cycles, residual ink, and
                calibration can add 5–20% to your effective cost per page.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {wasteTypes.map((w) => (
                <div
                  key={w.title}
                  className="group rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-green-200 hover:bg-green-50/70"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-lime-50 shadow-inner">
                    {w.icon}
                  </div>
                  <h3 className="mb-2 text-sm font-black text-slate-950">
                    {w.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {w.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-8">
              <p className="mb-2 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
                Brand Guide
              </p>
              <h2 className="mb-3 text-2xl font-black text-slate-950">
                Major Printer Brands: Cost & Ink Consumption
              </h2>
              <p className="text-slate-600">
                The true cost of printing goes beyond the initial price.
                Cartridge yield, ink technology, and waste factors all determine
                your long-term cost per page.
              </p>
            </div>

            <div className="space-y-4">
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className={`rounded-[2rem] border ${brand.accent} bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(22,163,74,0.14)]`}
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-black text-slate-950">
                          {brand.name}
                        </h3>
                        <Badge className="rounded-xl bg-slate-100 text-xs text-slate-700">
                          {brand.type}
                        </Badge>
                      </div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-green-700">
                        {brand.inkTech}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {brand.wasteNotes}
                      </p>
                    </div>

                    <div className="grid min-w-[260px] flex-shrink-0 grid-cols-3 gap-3 text-center">
                      {[
                        { label: "Cost / Page", value: brand.costPerPage },
                        { label: "Yield Range", value: brand.cartridgeYield },
                        { label: "Waste Factor", value: brand.wasteFactor },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-2xl border border-white/80 bg-green-50/70 p-3"
                        >
                          <p className="mb-1 text-xs text-slate-500">
                            {stat.label}
                          </p>
                          <p className="text-xs font-black text-slate-950">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
              Best Practices
            </p>
            <h2 className="mb-6 text-2xl font-black text-slate-950">
              Reduce Your Print Waste
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Print regularly — idle printers consume more ink on cleaning cycles than active ones.",
                "Use draft mode for internal documents; reserve high-quality mode for client-facing materials.",
                "Use the SCTD Ink Coverage Estimator before large print runs to forecast your true cost.",
                "Choose laser printers for high-volume monochrome printing — toner lasts longer than ink.",
                "Avoid third-party cartridges that trigger excessive cleaning cycles on brand-name printers.",
                "Monitor waste toner box levels on laser printers to avoid unexpected downtime.",
              ].map((tip) => (
                <div
                  key={tip}
                  className="flex items-start gap-3 rounded-[1.5rem] border border-white/80 bg-white/75 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <p className="text-sm text-slate-700">{tip}</p>
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
