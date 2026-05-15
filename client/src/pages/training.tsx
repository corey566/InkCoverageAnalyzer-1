import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Users,
  Clock,
  Award,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";

const modules = [
  {
    number: "01",
    title: "Introduction to Ink Coverage",
    duration: "~10 min",
    level: "Beginner",
    levelColor: "bg-green-100 text-green-800",
    topics: [
      "What is ink coverage and why it matters",
      "How coverage % is measured (CMYK channels)",
      "The 5% coverage standard and what it means",
      "CMYK vs Color + Black printing modes",
    ],
  },
  {
    number: "02",
    title: "Using the SCTD Estimator",
    duration: "~15 min",
    level: "Beginner",
    levelColor: "bg-green-100 text-green-800",
    topics: [
      "Uploading PDF and image files",
      "Choosing the right analysis mode",
      "Reading the coverage bars and percentages",
      "Understanding the page-by-page breakdown table",
      "Previewing your document in the browser",
    ],
  },
  {
    number: "03",
    title: "Cost Estimation",
    duration: "~20 min",
    level: "Intermediate",
    levelColor: "bg-yellow-100 text-yellow-800",
    topics: [
      "Finding your cartridge's rated yield",
      "Entering cartridge yield and price",
      "Understanding the Waste / Variation Factor",
      "Interpreting base vs adjusted cost",
      "What the ±8% cost range represents",
    ],
  },
  {
    number: "04",
    title: "Advanced Interpretation",
    duration: "~25 min",
    level: "Intermediate",
    levelColor: "bg-yellow-100 text-yellow-800",
    topics: [
      "Comparing CMYK results across document types",
      "Identifying high ink-load pages",
      "Using coverage data to optimise designs before printing",
      "Choosing between inkjet and laser for your coverage profile",
    ],
  },
  {
    number: "05",
    title: "Exporting & Reporting",
    duration: "~10 min",
    level: "Intermediate",
    levelColor: "bg-yellow-100 text-yellow-800",
    topics: [
      "Generating a PDF report with one click",
      "What is included in the exported report",
      "Sharing reports with clients or management",
      "Using cost reports in quoting and procurement",
    ],
  },
  {
    number: "06",
    title: "Enterprise & High-Volume Use",
    duration: "~20 min",
    level: "Advanced",
    levelColor: "bg-red-100 text-red-800",
    topics: [
      "Handling large multi-page PDFs efficiently",
      "Running multiple analyses for comparison",
      "Integrating estimates into your quoting workflow",
      "Privacy considerations for sensitive documents",
      "Requesting enterprise support from SCTD",
    ],
  },
];

const tips = [
  {
    title: "Start with a sample document",
    description:
      "Upload a document you already know well — a regular invoice or company letterhead — to understand what the coverage percentages mean for your typical print output.",
  },
  {
    title: "Compare design variations",
    description:
      "If you have multiple versions of a design, run both through the estimator. A small change in background colour can significantly affect your ink cost.",
  },
  {
    title: "Use the waste factor honestly",
    description:
      "If your printer is older or you rarely print, increase the waste factor to 15–20%. Newer, regularly-used printers can use 5–8%.",
  },
  {
    title: "Match your mode to your printer",
    description:
      "Check your printer manual to confirm whether it uses separate CMYK toners or a combined tri-colour cartridge. Use the matching mode for accurate cost modelling.",
  },
];

export default function Training() {
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
            <span className="text-white/70">Training Centre</span>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300 backdrop-blur">
            <BookOpen className="h-4 w-4" />
            Training Centre
          </div>

          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
            Learn the Platform
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-green-50/75">
            Master ink coverage analysis and cost estimation with our structured
            training modules — from beginner to advanced.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-green-50/75">
            {[
              { icon: Clock, text: "~100 minutes total" },
              { icon: Users, text: "All skill levels" },
              { icon: Award, text: "Self-paced" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.text}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur"
                >
                  <Icon className="h-4 w-4 text-green-300" />
                  {item.text}
                </span>
              );
            })}
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

        <div className="relative mx-auto max-w-4xl space-y-16 px-6">
          <div>
            <p className="mb-2 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
              Curriculum
            </p>
            <h2 className="mb-8 text-2xl font-black text-slate-950">
              Training Modules
            </h2>

            <div className="space-y-4">
              {modules.map((m) => (
                <div
                  key={m.number}
                  className="rounded-[1.75rem] border border-white/80 bg-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-green-200 hover:bg-green-50/60"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-lg font-black text-white shadow-lg shadow-green-100">
                      {m.number}
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-black text-slate-950">
                          {m.title}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${m.levelColor}`}
                        >
                          {m.level}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {m.duration}
                        </span>
                      </div>

                      <ul className="space-y-1.5">
                        {m.topics.map((t) => (
                          <li
                            key={t}
                            className="flex items-start gap-2 text-sm text-slate-500"
                          >
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-600" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
              Pro Tips
            </p>
            <h2 className="mb-6 text-2xl font-black text-slate-950">
              Getting the Most Out of the Estimator
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {tips.map((tip) => (
                <div
                  key={tip.title}
                  className="flex items-start gap-3 rounded-[1.5rem] border border-white/80 bg-white/75 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-green-200"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-green-100">
                    <PlayCircle className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-black text-slate-950">
                      {tip.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-green-50 to-lime-50 shadow-inner">
              <BookOpen className="h-8 w-8 text-green-700" />
            </div>

            <h2 className="mb-2 text-2xl font-black text-slate-950">
              Ready to put it into practice?
            </h2>
            <p className="mb-7 text-slate-500">
              Head to the estimator and upload your first document in under a
              minute.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/">
                <button className="rounded-full bg-gradient-to-r from-green-600 via-green-500 to-lime-400 px-8 py-3 text-sm font-black text-white shadow-xl shadow-green-100 transition-all hover:-translate-y-0.5">
                  Open the Estimator
                </button>
              </Link>

              <Link href="/documentation">
                <button className="inline-flex items-center gap-2 rounded-full border-2 border-green-300 bg-white px-8 py-3 text-sm font-black text-green-700 transition-all hover:bg-green-50">
                  Read the Docs
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
