import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, CheckCircle2, Users, Clock, Award, Link as LinkIcon } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Training Centre</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn the Platform</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Master ink coverage analysis and cost estimation with our structured training modules — from beginner to advanced.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-blue-300">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> ~100 minutes total</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> All skill levels</span>
            <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Self-paced</span>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 space-y-16">

        {/* Modules */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Training Modules</h2>
          <div className="space-y-5">
            {modules.map((m) => (
              <Card key={m.number} className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg">
                      {m.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{m.title}</h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.levelColor}`}>{m.level}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{m.duration}</span>
                      </div>
                      <ul className="space-y-1">
                        {m.topics.map((t) => (
                          <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pro Tips */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pro Tips for Getting the Most Out of the Estimator</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {tips.map((tip) => (
              <Card key={tip.title} className="border-gray-200 shadow-sm bg-white">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <PlayCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
          <BookOpen className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to put it into practice?</h2>
          <p className="text-gray-600 mb-6">Head to the estimator and upload your first document in under a minute.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8">
                Open the Estimator
              </Button>
            </Link>
            <Link href="/documentation">
              <Button variant="outline" className="font-semibold px-8">
                Read the Docs
              </Button>
            </Link>
          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
}
