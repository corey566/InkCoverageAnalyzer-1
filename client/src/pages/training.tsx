import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookOpen, PlayCircle, CheckCircle2, Users, Clock, Award, ChevronRight } from "lucide-react";
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
    description: "Upload a document you already know well — a regular invoice or company letterhead — to understand what the coverage percentages mean for your typical print output.",
  },
  {
    title: "Compare design variations",
    description: "If you have multiple versions of a design, run both through the estimator. A small change in background colour can significantly affect your ink cost.",
  },
  {
    title: "Use the waste factor honestly",
    description: "If your printer is older or you rarely print, increase the waste factor to 15–20%. Newer, regularly-used printers can use 5–8%.",
  },
  {
    title: "Match your mode to your printer",
    description: "Check your printer manual to confirm whether it uses separate CMYK toners or a combined tri-colour cartridge. Use the matching mode for accurate cost modelling.",
  },
];

export default function Training() {
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
            <span className="text-white/70">Training Centre</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/10">
            <BookOpen className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">Training Centre</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn the Platform</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(133, 30%, 75%)" }}>
            Master ink coverage analysis and cost estimation with our structured training modules — from beginner to advanced.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm" style={{ color: "hsl(133, 30%, 68%)" }}>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> ~100 minutes total</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> All skill levels</span>
            <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Self-paced</span>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-6 space-y-16">

        {/* Modules */}
        <div>
          <p className="section-label mb-2">Curriculum</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Training Modules</h2>
          <div className="space-y-4">
            {modules.map((m) => (
              <div
                key={m.number}
                className="bg-white rounded-2xl border border-gray-100 p-6"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg text-white" style={{ background: "hsl(148, 62%, 10%)" }}>
                    {m.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-sm">{m.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.levelColor}`}>{m.level}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{m.duration}</span>
                    </div>
                    <ul className="space-y-1">
                      {m.topics.map((t) => (
                        <li key={t} className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(133, 55%, 40%)" }} />
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

        {/* Pro Tips */}
        <div>
          <p className="section-label mb-2">Pro Tips</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting the Most Out of the Estimator</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className="flex items-start gap-3 p-5 bg-white rounded-xl border border-gray-100"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(133, 48%, 94%)" }}>
                  <PlayCircle className="w-4 h-4" style={{ color: "hsl(133, 48%, 36%)" }} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{tip.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="text-center rounded-2xl border border-gray-100 p-10"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "hsl(133, 48%, 94%)" }}>
            <BookOpen className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to put it into practice?</h2>
          <p className="text-gray-500 mb-7">Head to the estimator and upload your first document in under a minute.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <button className="btn-primary px-8 py-3">Open the Estimator</button>
            </Link>
            <Link href="/documentation">
              <button
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm border-2 transition-all"
                style={{ borderColor: "hsl(133, 48%, 36%)", color: "hsl(133, 48%, 36%)" }}
              >
                Read the Docs
              </button>
            </Link>
          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
}
