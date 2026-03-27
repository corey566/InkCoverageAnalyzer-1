import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Building2, ShieldCheck, Users, BarChart3, Globe, Headphones, CheckCircle2, Mail, Phone, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: <BarChart3 className="w-6 h-6" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "High-Volume Analysis",
    description: "Process large PDF files with hundreds of pages and get complete CMYK coverage breakdowns across every page in your document.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Data Privacy Guarantee",
    description: "No document content is stored, logged, or retained. All files are processed in memory and immediately discarded after analysis.",
  },
  {
    icon: <Users className="w-6 h-6" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Multi-User Environments",
    description: "Designed for print shops, marketing teams, and production departments. Multiple users can run analyses simultaneously.",
  },
  {
    icon: <Globe className="w-6 h-6" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Caribbean & Regional Focus",
    description: "Built and managed by Sterling Carter Technology Distributors in Jamaica, with expertise in the Caribbean printing and distribution market.",
  },
  {
    icon: <Building2 className="w-6 h-6" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Custom Deployments",
    description: "Need a white-label or on-premise version of the estimator for your business? Contact our team to discuss enterprise licensing options.",
  },
  {
    icon: <Headphones className="w-6 h-6" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Dedicated Support",
    description: "Enterprise customers receive priority email and phone support from our Jamaica-based team. Reach us at info@sctdjm.com or (876) 968-6637.",
  },
];

const useCases = [
  {
    title: "Commercial Print Shops",
    description: "Quote customers accurately before every job. Know your true cost per page before committing to a price, eliminating profit-margin surprises on complex print runs.",
  },
  {
    title: "Marketing & Creative Agencies",
    description: "Estimate print costs for campaigns at the design stage. Compare design variants before going to print to choose the most cost-effective option.",
  },
  {
    title: "Publishing Houses",
    description: "Analyse covers and interior pages separately. Use CMYK mode for four-colour printing and Color+Black mode for two-cartridge desktop printers.",
  },
  {
    title: "Government & Public Sector",
    description: "Control print budgets with confidence. The no-data-retention policy means sensitive documents can be analysed without compliance concerns.",
  },
  {
    title: "Educational Institutions",
    description: "Manage print room costs effectively. Estimate ink usage for course materials, exam papers, and handouts before large print runs.",
  },
  {
    title: "Corporate Procurement",
    description: "Use coverage data to negotiate cartridge contracts. Accurate per-page cost modelling gives your procurement team data-backed leverage.",
  },
];

export default function Enterprise() {
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
            <span className="text-white/70">Enterprise</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/10">
            <Building2 className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">Enterprise Solutions</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Built for Serious Print Operations</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(133, 30%, 75%)" }}>
            The SCTD Ink Coverage Estimator is designed to support professional print environments — from single-user print shops to multi-department enterprise deployments.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <button className="btn-primary px-8 py-3">Contact Sales</button>
            </Link>
            <Link href="/">
              <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm border border-white/25 text-white hover:bg-white/10 transition-all">
                Try the Estimator
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-5xl mx-auto px-6 space-y-20">

        {/* Features */}
        <div>
          <p className="section-label mb-2">Capabilities</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Enterprise-Grade Features</h2>
          <p className="text-gray-500 mb-10">Everything you need to run accurate, reliable ink cost analysis at scale.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="service-card">
                <div className="icon-box">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <p className="section-label mb-2">Use Cases</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Who Uses This Platform?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {useCases.map((uc) => (
              <div key={uc.title} className="flex gap-4 p-5 bg-white rounded-xl border border-gray-100" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(133, 55%, 40%)" }} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{uc.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{uc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 text-center text-white"
          style={{ background: "linear-gradient(135deg, #0a2010 0%, #0d2d18 100%)" }}
        >
          <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
          <p className="mb-6 max-w-xl mx-auto" style={{ color: "hsl(133, 30%, 75%)" }}>
            Contact our team to discuss enterprise licensing, custom deployments, or to get support with your current printing setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@sctdjm.com"
              className="inline-flex items-center gap-2 bg-white font-semibold px-6 py-3 rounded-full transition-colors hover:bg-gray-100"
              style={{ color: "hsl(133, 48%, 22%)" }}
            >
              <Mail className="w-4 h-4" />
              info@sctdjm.com
            </a>
            <a
              href="tel:+18769686637"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <Phone className="w-4 h-4" />
              (876) 968-6637
            </a>
          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
}
