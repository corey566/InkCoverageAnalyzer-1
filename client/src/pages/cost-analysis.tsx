import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, BarChart3, ShieldCheck, DollarSign, Zap } from "lucide-react";

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
    badgeColor: "bg-blue-100 text-blue-800",
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
    badgeColor: "bg-purple-100 text-purple-800",
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
    notes: "Comprehensive enterprise print management solution. Focuses on cost allocation, user quotas, and secure printing. Does not provide pre-print ink coverage estimation — only historical job-based cost tracking.",
  },
  {
    name: "Ink Coverage Calculator (online)",
    highlight: false,
    badge: "Free / Limited",
    badgeColor: "bg-gray-100 text-gray-800",
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
    notes: "Generic online tools typically rely on simple RGB pixel sampling, which is inaccurate for professional CMYK print estimation. Limited to single images and cannot handle multi-page PDFs or calculate per-channel costs.",
  },
  {
    name: "Prepress Calc Tools",
    highlight: false,
    badge: "Professional",
    badgeColor: "bg-orange-100 text-orange-800",
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
    notes: "Professional RIP (Raster Image Processor) tools provide accurate CMYK analysis but are expensive and complex. Primarily designed for large commercial printers, not small-to-medium print shops or individuals.",
  },
];

const benefits = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Powered by Ghostscript",
    description: "Uses the industry-standard Ghostscript INKCOV device for accurate CMYK measurement — the same engine used in professional prepress workflows.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
    title: "Full CMYK Breakdown",
    description: "Unlike generic tools, we provide separate Cyan, Magenta, Yellow, and Black coverage per page — essential for accurate cost modelling.",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-green-500" />,
    title: "Completely Free",
    description: "No subscription, no credits, no limits. The SCTD estimator is free for all users — individuals, small businesses, and enterprises alike.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
    title: "No Data Retained",
    description: "Your documents are processed and immediately discarded. We retain no user data, no document content, and no personal information.",
  },
];

export default function CostAnalysis() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Platform Comparison</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cost Analysis Tools</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            See how the SCTD Ink Coverage Estimator compares to other platforms in accuracy, features, and value.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-4 space-y-16">

        {/* Why SCTD */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Why Choose SCTD?</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Most online ink estimators use basic pixel-counting methods. We use the same technology trusted by commercial print shops for decades.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <Card key={b.title} className="text-center border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {b.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{b.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform comparison */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Platform Comparison</h2>
          <div className="space-y-5">
            {platforms.map((platform) => (
              <Card
                key={platform.name}
                className={`shadow-sm ${platform.highlight ? "border-2 border-green-400 ring-2 ring-green-100" : "border-gray-200"}`}
              >
                <CardContent className={`p-6 ${platform.highlight ? "bg-green-50" : "bg-white"}`}>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">{platform.name}</h3>
                        <Badge className={platform.badgeColor}>{platform.badge}</Badge>
                        {platform.highlight && (
                          <Badge className="bg-yellow-400 text-yellow-900">Best Value</Badge>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Accuracy note */}
        <Card className="bg-blue-50 border-blue-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-bold text-blue-900 mb-2 text-lg">A Note on Accuracy</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Ink coverage estimation is inherently approximate. Real-world print costs vary based on environmental conditions, paper type, print speed, and printer maintenance status. The SCTD estimator adds a configurable waste/variation factor (default 10%) and provides a ±8% range to give you a realistic cost window rather than a false sense of precision. We believe transparency about uncertainty is more valuable than false exactness.
            </p>
          </CardContent>
        </Card>

      </section>

      <Footer />
    </div>
  );
}
