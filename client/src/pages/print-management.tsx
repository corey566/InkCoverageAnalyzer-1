import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Printer, Droplets, TrendingDown, AlertTriangle, CheckCircle2, Info, ChevronRight } from "lucide-react";

const brands = [
  {
    name: "HP (Hewlett-Packard)",
    type: "Inkjet & Laser",
    costPerPage: "$0.04–$0.12",
    cartridgeYield: "1,000–8,000 pages",
    wasteFactor: "8–12%",
    inkTech: "Thermal inkjet / Laser toner",
    wasteNotes: "HP printers perform regular printhead cleaning cycles which consume significant ink even when idle. Ink evaporation during priming adds another 5–8% waste.",
    accent: "border-l-4 border-blue-400",
  },
  {
    name: "Epson",
    type: "Inkjet (EcoTank)",
    costPerPage: "$0.01–$0.09",
    cartridgeYield: "6,000–14,000 pages",
    wasteFactor: "3–7%",
    inkTech: "Piezoelectric inkjet",
    wasteNotes: "EcoTank models dramatically reduce waste by using refillable tanks. Piezoelectric technology does not heat ink, reducing evaporation. Periodic nozzle checks consume minimal ink.",
    accent: "border-l-4 border-green-500",
  },
  {
    name: "Canon",
    type: "Inkjet & Laser",
    costPerPage: "$0.05–$0.14",
    cartridgeYield: "400–10,000 pages",
    wasteFactor: "7–11%",
    inkTech: "Thermal inkjet / Electrophotographic",
    wasteNotes: "Canon inkjet models use Printhead Cleaning System (PCS) which can consume 1–2 ml per cycle. Deep cleaning for clogs is especially wasteful. PIXMA printers have maintenance cartridges that fill with waste ink.",
    accent: "border-l-4 border-red-400",
  },
  {
    name: "Brother",
    type: "Laser & Inkjet",
    costPerPage: "$0.02–$0.08",
    cartridgeYield: "1,500–12,000 pages",
    wasteFactor: "5–9%",
    inkTech: "Laser toner / Piezoelectric inkjet",
    wasteNotes: "Brother laser printers generate toner waste collected in a waste toner box. Drum units require replacement separately. Inkjet models have fewer cleaning cycles than HP/Canon, reducing waste ink.",
    accent: "border-l-4 border-yellow-400",
  },
  {
    name: "Xerox",
    type: "Laser / Enterprise",
    costPerPage: "$0.01–$0.06",
    cartridgeYield: "5,000–30,000 pages",
    wasteFactor: "3–6%",
    inkTech: "Electrophotographic laser",
    wasteNotes: "Xerox enterprise printers are optimised for high-volume output. Waste toner is collected efficiently, and some models offer waste-free toner cartridges. Yield consistency is very high across large print runs.",
    accent: "border-l-4 border-purple-400",
  },
  {
    name: "Kyocera",
    type: "Laser / Enterprise",
    costPerPage: "$0.008–$0.04",
    cartridgeYield: "8,000–40,000 pages",
    wasteFactor: "2–4%",
    inkTech: "Ecosys laser technology",
    wasteNotes: "Kyocera's ECOSYS technology uses long-life drums separate from toner cartridges, significantly reducing consumable waste. Among the lowest waste factors in the industry. Ideal for high-volume environments.",
    accent: "border-l-4 border-indigo-400",
  },
];

const wasteTypes = [
  {
    icon: <Droplets className="w-5 h-5" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Printhead Cleaning Cycles",
    description: "Inkjet printers purge ink through the printhead nozzles to prevent clogging, especially after periods of inactivity. This can consume 5–15% of a cartridge's total ink.",
  },
  {
    icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    title: "Ink Left in Empty Cartridges",
    description: "Manufacturers set 'empty' thresholds before cartridges are actually depleted to protect the printhead. Up to 20–30% of ink can remain in a 'dead' cartridge.",
  },
  {
    icon: <TrendingDown className="w-5 h-5 text-red-500" />,
    title: "Ink Evaporation",
    description: "Thermal inkjet printers heat ink repeatedly, causing evaporation over time — particularly in printers that are left idle for extended periods.",
  },
  {
    icon: <Printer className="w-5 h-5 text-gray-600" />,
    title: "Test Pages & Calibration",
    description: "Every printer prints alignment sheets, nozzle checks, and calibration patterns during setup and maintenance. These consume ink and paper without productive output.",
  },
  {
    icon: <Info className="w-5 h-5 text-purple-500" />,
    title: "Toner Waste Boxes",
    description: "Laser printers collect waste toner in a separate box. This toner — from cleaning the drum between jobs — represents 3–6% of total toner consumption.",
  },
];

export default function PrintManagement() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a2010 0%, #0d2d18 55%, #112b14 100%)" }} />
        <div className="absolute top-0 right-0 w-80 h-80 dot-pattern pointer-events-none" style={{ opacity: 0.30 }} />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-green-300/80 font-medium">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Print Management</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/10">
            <Printer className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">Print Management Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Printer Management</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(133, 30%, 75%)" }}>
            Understand how different printers consume ink, where waste comes from, and how to choose the right printer for your print volume and budget.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-5xl mx-auto px-6 space-y-20">

        {/* Waste breakdown */}
        <div>
          <div className="mb-10">
            <p className="section-label mb-2">Understanding Waste</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Where Does Ink Waste Come From?</h2>
            <p className="text-gray-500 max-w-2xl">
              Printer manufacturers rate cartridge yield at 5% page coverage. In real-world use, waste from cleaning cycles, residual ink, and calibration can add 5–20% to your effective cost per page.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {wasteTypes.map((w) => (
              <div key={w.title} className="service-card">
                <div className="icon-box-sm mb-4">{w.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{w.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{w.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand comparison */}
        <div>
          <div className="mb-8">
            <p className="section-label mb-2">Brand Guide</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Major Printer Brands: Cost & Ink Consumption</h2>
            <p className="text-gray-500">
              The true cost of printing goes beyond the initial price. Cartridge yield, ink technology, and waste factors all determine your long-term cost per page.
            </p>
          </div>
          <div className="space-y-4">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className={`bg-white rounded-2xl border border-gray-100 p-6 ${brand.accent}`}
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-bold text-gray-900">{brand.name}</h3>
                      <Badge className="bg-gray-100 text-gray-700 text-xs">{brand.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{brand.wasteNotes}</p>
                  </div>
                  <div className="flex-shrink-0 grid grid-cols-3 gap-3 text-center min-w-[260px]">
                    {[
                      { label: "Cost / Page", value: brand.costPerPage },
                      { label: "Yield Range", value: brand.cartridgeYield },
                      { label: "Waste Factor", value: brand.wasteFactor },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                        <p className="text-xs font-bold text-gray-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <p className="section-label mb-2">Best Practices</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reduce Your Print Waste</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Print regularly — idle printers consume more ink on cleaning cycles than active ones.",
              "Use draft mode for internal documents; reserve high-quality mode for client-facing materials.",
              "Use the SCTD Ink Coverage Estimator before large print runs to forecast your true cost.",
              "Choose laser printers for high-volume monochrome printing — toner lasts longer than ink.",
              "Avoid third-party cartridges that trigger excessive cleaning cycles on brand-name printers.",
              "Monitor waste toner box levels on laser printers to avoid unexpected downtime.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(133, 55%, 40%)" }} />
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
