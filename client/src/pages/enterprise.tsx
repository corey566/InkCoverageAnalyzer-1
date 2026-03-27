import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ShieldCheck, Users, BarChart3, Globe, Headphones, CheckCircle2, Mail, Phone } from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    title: "High-Volume Analysis",
    description: "Process large PDF files with hundreds of pages and get complete CMYK coverage breakdowns across every page in your document.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
    title: "Data Privacy Guarantee",
    description: "No document content is stored, logged, or retained. All files are processed in memory and immediately discarded after analysis.",
  },
  {
    icon: <Users className="w-6 h-6 text-purple-600" />,
    title: "Multi-User Environments",
    description: "Designed for print shops, marketing teams, and production departments. Multiple users can run analyses simultaneously.",
  },
  {
    icon: <Globe className="w-6 h-6 text-orange-600" />,
    title: "Caribbean & Regional Focus",
    description: "Built and managed by Sterling Carter Technology Distributors in Jamaica, with expertise in the Caribbean printing and distribution market.",
  },
  {
    icon: <Building2 className="w-6 h-6 text-indigo-600" />,
    title: "Custom Deployments",
    description: "Need a white-label or on-premise version of the estimator for your business? Contact our team to discuss enterprise licensing options.",
  },
  {
    icon: <Headphones className="w-6 h-6 text-red-600" />,
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">Enterprise Solutions</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Built for Serious Print Operations</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            The SCTD Ink Coverage Estimator is designed to support professional print environments — from single-user print shops to multi-department enterprise deployments.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8">
                Contact Sales
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8">
                Try the Estimator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4 space-y-16">

        {/* Features */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enterprise-Grade Features</h2>
          <p className="text-gray-600 mb-8">Everything you need to run accurate, reliable ink cost analysis at scale.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Who Uses This Platform?</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {useCases.map((uc) => (
              <div key={uc.title} className="flex gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{uc.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{uc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 border-0 shadow-lg">
          <CardContent className="p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
            <p className="text-blue-200 mb-6 max-w-xl mx-auto">
              Contact our team to discuss enterprise licensing, custom deployments, or to get support with your current printing setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:info@sctdjm.com" className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition-colors">
                <Mail className="w-4 h-4" />
                info@sctdjm.com
              </a>
              <a href="tel:+18769686637" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3 rounded-lg transition-colors">
                <Phone className="w-4 h-4" />
                (876) 968-6637
              </a>
            </div>
          </CardContent>
        </Card>

      </section>

      <Footer />
    </div>
  );
}
