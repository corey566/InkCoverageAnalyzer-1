import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload, Settings2, BarChart3, Calculator, Download, FileText,
  Layers, Printer, ChevronRight, Info
} from "lucide-react";

const steps = [
  {
    step: 1,
    icon: <Settings2 className="w-5 h-5 text-white" />,
    color: "bg-blue-600",
    title: "Choose Analysis Mode",
    description: "Select either CMYK Mode or Color + Black mode before uploading.",
    detail: "CMYK Mode separates ink into four channels: Cyan, Magenta, Yellow, and Black — ideal for professional four-colour offset or laser printers. Color + Black Mode combines CMY channels into a single 'Color' average, matching how standard desktop inkjet printers with separate color and black cartridges work.",
  },
  {
    step: 2,
    icon: <Upload className="w-5 h-5 text-white" />,
    color: "bg-indigo-600",
    title: "Upload Your Document",
    description: "Drag and drop, or click to browse and select your file.",
    detail: "Supported formats: PDF (multi-page), PNG, JPG/JPEG, TIFF, EPS. Maximum file size: 50MB. PDF files are analysed using Ghostscript's INKCOV device which provides true CMYK ink coverage per page. Image files (PNG, JPG, TIFF) are converted to CMYK colour space for analysis.",
  },
  {
    step: 3,
    icon: <FileText className="w-5 h-5 text-white" />,
    color: "bg-purple-600",
    title: "Preview Your Document",
    description: "After uploading, see a live preview of your document.",
    detail: "PDFs are rendered in an interactive viewer that lets you scroll through all pages. Images are displayed with zoom controls (50%–200%). Click 'Open' to view the file in a new browser tab.",
  },
  {
    step: 4,
    icon: <BarChart3 className="w-5 h-5 text-white" />,
    color: "bg-cyan-600",
    title: "Start Analysis",
    description: "Click 'Analyze Ink Coverage' to start the CMYK analysis.",
    detail: "Analysis typically completes in 5–60 seconds depending on file size and number of pages. A spinner shows while analysis is in progress. Results update automatically once complete — you do not need to refresh the page.",
  },
  {
    step: 5,
    icon: <Calculator className="w-5 h-5 text-white" />,
    color: "bg-green-600",
    title: "Review Coverage Results",
    description: "See overall ink coverage and a page-by-page breakdown.",
    detail: "The Overall Ink Coverage card shows average CMYK percentages across all pages. The Page-by-Page Breakdown table shows per-page values. For documents with more than 5 pages, click 'Show all pages' to expand the table.",
  },
  {
    step: 6,
    icon: <Calculator className="w-5 h-5 text-white" />,
    color: "bg-orange-600",
    title: "Calculate Cost Per Page",
    description: "Enter your cartridge yield and price to get cost estimates.",
    detail: "For each cartridge, enter the rated page yield (at 5% coverage) and your purchase price. Adjust the Waste/Variation Factor to account for cleaning cycles and printer waste (default 10%). Click 'Calculate Cost Per Page' to see base cost, adjusted cost, and a ±8% variation range.",
  },
  {
    step: 7,
    icon: <Download className="w-5 h-5 text-white" />,
    color: "bg-red-600",
    title: "Export PDF Report",
    description: "Download a professional PDF report of your analysis and cost results.",
    detail: "Click 'Export PDF Report' to generate and download a formatted PDF including the SCTD branding, contact information, overall coverage summary, page-by-page breakdown table, and cost estimation results (if calculated).",
  },
];

const faqs = [
  {
    q: "What does 5% page coverage mean?",
    a: "Cartridge manufacturers rate yield based on a test page where ink covers exactly 5% of the page area — roughly the amount of ink on a standard business letter. Most real documents use more than 5% coverage, which means your effective yield will be lower than the rated yield.",
  },
  {
    q: "How is the effective yield calculated?",
    a: "Effective Yield = Rated Yield × (5% ÷ Actual Coverage%). For example, if your cartridge is rated at 1,000 pages at 5% coverage but your document uses 20% coverage, the effective yield is 1,000 × (5/20) = 250 pages.",
  },
  {
    q: "What is the Waste / Variation Factor?",
    a: "This accounts for real-world losses: printhead cleaning cycles, residual ink in 'empty' cartridges, calibration prints, and other non-productive ink usage. A 10% waste factor is typical for inkjet printers; laser printers may be 3–6%.",
  },
  {
    q: "Why is there a ±8% range in cost results?",
    a: "Environmental factors — temperature, humidity, paper type, and printer age — all affect actual ink consumption. The ±8% range gives you a realistic cost window rather than implying false precision.",
  },
  {
    q: "Is my document stored on your servers?",
    a: "No. Documents are processed in a temporary directory and are not retained after analysis completes. No document content, personal information, or usage data is stored. See our Privacy Policy for full details.",
  },
  {
    q: "Why do image files sometimes give different results from PDFs?",
    a: "PDF files are analysed using Ghostscript's native PDF rendering with the INKCOV device, which is very accurate. Image files (PNG, JPG) are analysed by converting the RGB image to CMYK colour space using ImageMagick. The RGB-to-CMYK conversion can introduce minor differences from what a professional RIP would produce.",
  },
];

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Use the Estimator</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            A step-by-step guide to getting accurate ink coverage analysis and cost estimates from your documents.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 space-y-16">

        {/* Step-by-step */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Step-by-Step Guide</h2>
          <div className="space-y-5">
            {steps.map((s) => (
              <Card key={s.step} className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-gray-100 text-gray-600 text-xs">Step {s.step}</Badge>
                        <h3 className="font-bold text-gray-900">{s.title}</h3>
                      </div>
                      <p className="text-gray-700 font-medium text-sm mb-2">{s.description}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Modes explainer */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Modes Explained</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <Card className="border-blue-200 bg-blue-50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Layers className="w-5 h-5" /> CMYK Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 space-y-2">
                <p>Analyses each colour channel separately: Cyan, Magenta, Yellow, and Black.</p>
                <p>Best for: professional four-colour printing, offset presses, laser printers with separate CMYK toner cartridges.</p>
                <p>Output: four separate cost estimates — one per cartridge.</p>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Printer className="w-5 h-5" /> Color + Black Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-purple-800 space-y-2">
                <p>Combines Cyan, Magenta, and Yellow into a single "Color" average. Black remains separate.</p>
                <p>Best for: desktop inkjet printers that use a single tri-colour cartridge plus a black cartridge.</p>
                <p>Output: two cost estimates — color cartridge and black cartridge.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q} className="border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{faq.q}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
}
