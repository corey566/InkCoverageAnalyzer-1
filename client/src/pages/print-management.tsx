import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, Droplets, TrendingDown, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const brands = [
  {
    name: "HP (Hewlett-Packard)",
    type: "Inkjet & Laser",
    costPerPage: "$0.04–$0.12",
    cartridgeYield: "1,000–8,000 pages",
    wasteFactor: "8–12%",
    inkTech: "Thermal inkjet / Laser toner",
    wasteNotes: "HP printers perform regular printhead cleaning cycles which consume significant ink even when idle. Ink evaporation during priming adds another 5–8% waste.",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    name: "Epson",
    type: "Inkjet (EcoTank)",
    costPerPage: "$0.01–$0.09",
    cartridgeYield: "6,000–14,000 pages",
    wasteFactor: "3–7%",
    inkTech: "Piezoelectric inkjet",
    wasteNotes: "EcoTank models dramatically reduce waste by using refillable tanks. Piezoelectric technology does not heat ink, reducing evaporation. Periodic nozzle checks consume minimal ink.",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    badgeColor: "bg-green-100 text-green-800",
  },
  {
    name: "Canon",
    type: "Inkjet & Laser",
    costPerPage: "$0.05–$0.14",
    cartridgeYield: "400–10,000 pages",
    wasteFactor: "7–11%",
    inkTech: "Thermal inkjet / Electrophotographic",
    wasteNotes: "Canon inkjet models use Printhead Cleaning System (PCS) which can consume 1–2 ml per cycle. Deep cleaning for clogs is especially wasteful. PIXMA printers have maintenance cartridges that fill with waste ink.",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    badgeColor: "bg-red-100 text-red-800",
  },
  {
    name: "Brother",
    type: "Laser & Inkjet",
    costPerPage: "$0.02–$0.08",
    cartridgeYield: "1,500–12,000 pages",
    wasteFactor: "5–9%",
    inkTech: "Laser toner / Piezoelectric inkjet",
    wasteNotes: "Brother laser printers generate toner waste collected in a waste toner box. Drum units require replacement separately. Inkjet models have fewer cleaning cycles than HP/Canon, reducing waste ink.",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    badgeColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "Xerox",
    type: "Laser / Enterprise",
    costPerPage: "$0.01–$0.06",
    cartridgeYield: "5,000–30,000 pages",
    wasteFactor: "3–6%",
    inkTech: "Electrophotographic laser",
    wasteNotes: "Xerox enterprise printers are optimised for high-volume output. Waste toner is collected efficiently, and some models offer waste-free toner cartridges. Yield consistency is very high across large print runs.",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    badgeColor: "bg-purple-100 text-purple-800",
  },
  {
    name: "Kyocera",
    type: "Laser / Enterprise",
    costPerPage: "$0.008–$0.04",
    cartridgeYield: "8,000–40,000 pages",
    wasteFactor: "2–4%",
    inkTech: "Ecosys laser technology",
    wasteNotes: "Kyocera's ECOSYS technology uses long-life drums separate from toner cartridges, significantly reducing consumable waste. Among the lowest waste factors in the industry. Ideal for high-volume environments.",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    badgeColor: "bg-indigo-100 text-indigo-800",
  },
];

const wasteTypes = [
  {
    icon: <Droplets className="w-5 h-5 text-blue-600" />,
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
    icon: <Info className="w-5 h-5 text-purple-600" />,
    title: "Toner Waste Boxes",
    description: "Laser printers collect waste toner in a separate box. This toner — from cleaning the drum between jobs — represents 3–6% of total toner consumption.",
  },
];

export default function PrintManagement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <Printer className="w-4 h-4" />
            <span className="text-sm font-medium">Print Management Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Printer Management</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Understand how different printers consume ink, where waste comes from, and how to choose the right printer for your print volume and budget.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4 space-y-16">

        {/* Waste breakdown */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Where Does Ink Waste Come From?</h2>
          <p className="text-gray-600 mb-8">
            Printer manufacturers rate cartridge yield at 5% page coverage — a single letter-sized page with moderate content. In real-world use, waste from cleaning cycles, residual ink, and calibration can add 5–20% to your effective cost per page.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {wasteTypes.map((w) => (
              <Card key={w.title} className="border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                      {w.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm">{w.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{w.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Brand comparison */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Major Printer Brands: Cost & Ink Consumption</h2>
          <p className="text-gray-600 mb-8">
            The true cost of printing goes beyond the initial price of the printer. Cartridge yield, ink technology, and waste factors all determine your long-term cost per page.
          </p>
          <div className="space-y-5">
            {brands.map((brand) => (
              <Card key={brand.name} className={`border shadow-sm ${brand.borderColor}`}>
                <CardContent className={`p-6 ${brand.bgColor}`}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{brand.name}</h3>
                        <Badge className={brand.badgeColor}>{brand.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{brand.wasteNotes}</p>
                    </div>
                    <div className="flex-shrink-0 grid grid-cols-3 gap-4 text-center min-w-[280px]">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Cost / Page</p>
                        <p className="text-sm font-bold text-gray-900">{brand.costPerPage}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Yield Range</p>
                        <p className="text-sm font-bold text-gray-900">{brand.cartridgeYield}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Waste Factor</p>
                        <p className="text-sm font-bold text-gray-900">{brand.wasteFactor}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Practices to Reduce Print Waste</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Print regularly — idle printers consume more ink on cleaning cycles than active ones.",
              "Use draft mode for internal documents; reserve high-quality mode for client-facing materials.",
              "Use the SCTD Ink Coverage Estimator before large print runs to forecast your true cost.",
              "Choose laser printers for high-volume monochrome printing — toner lasts longer than ink.",
              "Avoid third-party cartridges that trigger excessive cleaning cycles on brand-name printers.",
              "Monitor waste toner box levels on laser printers to avoid unexpected downtime.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
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
