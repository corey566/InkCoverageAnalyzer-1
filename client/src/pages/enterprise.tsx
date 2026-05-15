import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Building2,
  ShieldCheck,
  Users,
  BarChart3,
  Globe,
  Headphones,
  CheckCircle2,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: <BarChart3 className="h-6 w-6 text-green-700" />,
    title: "High-Volume Analysis",
    description:
      "Process large PDF files with hundreds of pages and get complete CMYK coverage breakdowns across every page in your document.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-green-700" />,
    title: "Data Privacy Guarantee",
    description:
      "No document content is stored, logged, or retained. All files are processed in memory and immediately discarded after analysis.",
  },
  {
    icon: <Users className="h-6 w-6 text-green-700" />,
    title: "Multi-User Environments",
    description:
      "Designed for print shops, marketing teams, and production departments. Multiple users can run analyses simultaneously.",
  },
  {
    icon: <Globe className="h-6 w-6 text-green-700" />,
    title: "Caribbean & Regional Focus",
    description:
      "Built and managed by Sterling Carter Technology Distributors in Jamaica, with expertise in the Caribbean printing and distribution market.",
  },
  {
    icon: <Building2 className="h-6 w-6 text-green-700" />,
    title: "Custom Deployments",
    description:
      "Need a white-label or on-premise version of the estimator for your business? Contact our team to discuss enterprise licensing options.",
  },
  {
    icon: <Headphones className="h-6 w-6 text-green-700" />,
    title: "Dedicated Support",
    description:
      "Enterprise customers receive priority email and phone support from our Jamaica-based team. Reach us at info@sctdjm.com or (876) 968-6637.",
  },
];

const useCases = [
  {
    title: "Commercial Print Shops",
    description:
      "Quote customers accurately before every job. Know your true cost per page before committing to a price, eliminating profit-margin surprises on complex print runs.",
  },
  {
    title: "Marketing & Creative Agencies",
    description:
      "Estimate print costs for campaigns at the design stage. Compare design variants before going to print to choose the most cost-effective option.",
  },
  {
    title: "Publishing Houses",
    description:
      "Analyse covers and interior pages separately. Use CMYK mode for four-colour printing and Color+Black mode for two-cartridge desktop printers.",
  },
  {
    title: "Government & Public Sector",
    description:
      "Control print budgets with confidence. The no-data-retention policy means sensitive documents can be analysed without compliance concerns.",
  },
  {
    title: "Educational Institutions",
    description:
      "Manage print room costs effectively. Estimate ink usage for course materials, exam papers, and handouts before large print runs.",
  },
  {
    title: "Corporate Procurement",
    description:
      "Use coverage data to negotiate cartridge contracts. Accurate per-page cost modelling gives your procurement team data-backed leverage.",
  },
];

export default function Enterprise() {
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
            <span className="text-white/70">Enterprise</span>
          </div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300 backdrop-blur">
            <Building2 className="h-4 w-4" />
            Enterprise Solutions
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
            Built for Serious Print Operations
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-green-50/75">
            The SCTD Ink Coverage Estimator is designed to support professional
            print environments — from single-user print shops to
            multi-department enterprise deployments.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <button className="rounded-full bg-gradient-to-r from-green-600 via-green-500 to-lime-400 px-8 py-3 text-sm font-black text-white shadow-xl shadow-green-950/30 transition-all hover:-translate-y-0.5">
                Contact Sales
              </button>
            </Link>
            <Link href="/">
              <button className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-3 text-sm font-bold text-white backdrop-blur transition-all hover:bg-white/10">
                Try the Estimator
              </button>
            </Link>
          </div>
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
            <p className="mb-2 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
              Capabilities
            </p>
            <h2 className="mb-3 text-2xl font-black text-slate-950">
              Enterprise-Grade Features
            </h2>
            <p className="mb-10 text-slate-600">
              Everything you need to run accurate, reliable ink cost analysis at
              scale.
            </p>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-green-200 hover:bg-green-50/70"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-lime-50 shadow-inner">
                    {f.icon}
                  </div>
                  <h3 className="mb-2 text-sm font-black text-slate-950">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
              Use Cases
            </p>
            <h2 className="mb-8 text-2xl font-black text-slate-950">
              Who Uses This Platform?
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {useCases.map((uc) => (
                <div
                  key={uc.title}
                  className="flex gap-4 rounded-[1.5rem] border border-white/80 bg-white/75 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-green-200"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <h3 className="mb-1 text-sm font-black text-slate-950">
                      {uc.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {uc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-green-300/20 bg-gradient-to-br from-green-950 via-green-900 to-black p-8 text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <h2 className="mb-3 text-2xl font-black">Ready to get started?</h2>
            <p className="mx-auto mb-6 max-w-xl text-green-50/75">
              Contact our team to discuss enterprise licensing, custom
              deployments, or to get support with your current printing setup.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:info@sctdjm.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-black text-green-900 transition-colors hover:bg-green-50"
              >
                <Mail className="h-4 w-4" />
                info@sctdjm.com
              </a>
              <a
                href="tel:+18769686637"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-black text-white transition-colors hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
                (876) 968-6637
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
