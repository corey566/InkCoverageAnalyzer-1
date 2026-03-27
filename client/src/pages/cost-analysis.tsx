import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, BarChart3, ShieldCheck, DollarSign, Zap, ChevronRight } from "lucide-react";

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
    notes: "Uses professional-grade Ghostscript INKCOV engine — the same technology used by prepress professionals worldwide. Provides separate CMYK percentages per page with full cost modelling. Completely free with no data retention.",
  },
  {
    name: "Printix",
    highlight: false,
    badge: "Subscription",
    badgeColor: "bg-gray-100 text-gray-700",
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
    notes: "Cloud-based print management primarily focused on tracking print jobs across networked printers. Requires software installation and a subscription. Does not perform pre-print ink coverage analysis.",
  },
  {
    name: "PaperCut MF",
    highlight: false,
    badge: "Enterprise",
    badgeColor: "bg-gray-100 text-gray-700",
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
    notes: "Comprehensive enterprise print management solution. Focuses on cost allocation, user quotas, and secure printing. Does not provide pre-print ink coverage estimation.",
  },
  {
    name: "Ink Coverage Calculator (online)",
    highlight: false,
    badge: "Free / Limited",
    badgeColor: "bg-gray-100 text-gray-700",
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
    notes: "Generic online tools typically rely on simple RGB pixel sampling, which is inaccurate for professional CMYK print estimation. Limited to single images, cannot handle multi-page PDFs.",
  },
  {
    name: "Prepress Calc Tools",
    highlight: false,
    badge: "Professional",
    badgeColor: "bg-gray-100 text-gray-700",
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
    notes: "Professional RIP tools provide accurate CMYK analysis but are expensive and complex. Primarily designed for large commercial printers, not small-to-medium print shops.",
  },
];

const benefits = [
  {
    icon: <Zap className="w-6 h-6" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Powered by Ghostscript",
    description: "Uses the industry-standard Ghostscript INKCOV device for accurate CMYK measurement — the same engine used in professional prepress workflows.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Full CMYK Breakdown",
    description: "Unlike generic tools, we provide separate Cyan, Magenta, Yellow, and Black coverage per page — essential for accurate cost modelling.",
  },
  {
    icon: <DollarSign className="w-6 h-6" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Completely Free",
    description: "No subscription, no credits, no limits. The SCTD estimator is free for all users — individuals, small businesses, and enterprises alike.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "No Data Retained",
    description: "Your documents are processed and immediately discarded. We retain no user data, no document content, and no personal information.",
  },
];

export default function CostAnalysis() {
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
            <span className="text-white/70">Cost Analysis</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/10">
            <BarChart3 className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">Platform Comparison</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cost Analysis Tools</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(133, 30%, 75%)" }}>
            See how the SCTD Ink Coverage Estimator compares to other platforms in accuracy, features, and value.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-6 space-y-20">

        {/* Why SCTD */}
        <div>
          <div className="text-center mb-12">
            <p className="section-label mb-3">Our Advantage</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Why Choose SCTD?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Most online ink estimators use basic pixel-counting methods. We use the same technology trusted by commercial print shops for decades.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="service-card text-center">
                <div className="icon-box mx-auto">{b.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform comparison */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Platform Comparison</h2>
          <div className="space-y-5">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className={`rounded-2xl border p-6 transition-all ${
                  platform.highlight
                    ? "border-green-400 bg-green-50"
                    : "border-gray-100 bg-white"
                }`}
                style={platform.highlight ? { boxShadow: "0 4px 20px rgba(46,160,80,0.12), 0 0 0 2px hsl(133,55%,80%)" } : { boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900">{platform.name}</h3>
                      <Badge className={platform.badgeColor}>{platform.badge}</Badge>
                      {platform.highlight && (
                        <Badge className="bg-green-600 text-white">Best Value</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span><strong>Accuracy:</strong> {platform.accuracy}</span>
                      <span><strong>Cost:</strong> {platform.cost}</span>
                      <span><strong>Method:</strong> {platform.method}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{platform.notes}</p>
                  </div>
                  <div className="lg:w-72 grid grid-cols-2 gap-1">
                    {platform.features.map((f) => (
                      <div key={f.label} className="flex items-center gap-2 text-xs">
                        {f.yes ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={f.yes ? "text-gray-800" : "text-gray-400"}>{f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy note */}
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <h3 className="font-bold mb-2 text-lg" style={{ color: "hsl(133, 48%, 22%)" }}>A Note on Accuracy</h3>
          <p className="text-sm leading-relaxed" style={{ color: "hsl(133, 35%, 30%)" }}>
            Ink coverage estimation is inherently approximate. Real-world print costs vary based on environmental conditions, paper type, print speed, and printer maintenance status. The SCTD estimator adds a configurable waste/variation factor (default 10%) and provides a ±8% range to give you a realistic cost window rather than a false sense of precision. We believe transparency about uncertainty is more valuable than false exactness.
          </p>
        </div>

      </section>

      <Footer />
    </div>
  );
}
