import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Mail } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the SCTD Ink Coverage Estimator (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, please discontinue your use of the Service immediately.

These Terms are governed by and construed in accordance with the laws of Jamaica. Any disputes arising from your use of the Service shall be subject to the exclusive jurisdiction of the courts of Jamaica.`,
  },
  {
    title: "2. Description of Service",
    content: `The SCTD Ink Coverage Estimator is a web-based tool that analyses uploaded documents to estimate ink or toner coverage and calculate estimated print cost per page. The Service is provided by Sterling Carter Technology Distributors ("SCTD"), a company incorporated in Jamaica.

The Service is provided free of charge for personal and commercial use. SCTD reserves the right to modify, suspend, or discontinue the Service at any time without prior notice.`,
  },
  {
    title: "3. User Responsibilities",
    content: `By using the Service, you agree to:

• Upload only documents that you own, have permission to analyse, or have a legitimate professional reason to process
• Not attempt to overload, disrupt, or otherwise interfere with the operation of the Service
• Not use the Service for any unlawful purpose
• Not attempt to reverse-engineer, copy, or reproduce the Service's analysis methodology without express written permission from SCTD
• Ensure that any documents containing third-party intellectual property are processed in accordance with applicable copyright and licensing terms

You are solely responsible for any documents you upload and the actions you take based on the analysis results.`,
  },
  {
    title: "4. Document Uploads and Data",
    content: `When you upload a document:

• You grant SCTD a temporary, limited licence to process the document for the sole purpose of performing ink coverage analysis
• This licence terminates automatically when processing is complete and the file is deleted
• SCTD does not claim any ownership rights over your uploaded documents
• No document content is retained, stored permanently, shared, or used for any purpose other than providing the analysis result to you

Please refer to our Privacy Policy for full details on how uploaded documents are handled.`,
  },
  {
    title: "5. Accuracy of Results",
    content: `The analysis results provided by the Service are estimates based on industry-standard methodologies (Ghostscript INKCOV for PDFs; CMYK colour space conversion for images). These estimates are subject to the following limitations:

• Cartridge yield ratings vary between manufacturers and printer models
• Real-world print conditions (humidity, temperature, paper type, printer age) affect actual ink consumption
• The ±8% cost range provided reflects but does not exhaustively account for all real-world variables
• Results for image files (PNG, JPG) may differ from professional RIP analysis due to RGB-to-CMYK colour space conversion

SCTD does not guarantee that the estimated costs will exactly match actual printing costs. You should treat all results as informed estimates and exercise professional judgement when making procurement or pricing decisions.`,
  },
  {
    title: "6. Disclaimer of Warranties",
    content: `The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, accuracy, or non-infringement.

SCTD does not warrant that:
• The Service will be uninterrupted, error-free, or free of viruses or other harmful components
• The results of using the Service will meet your specific requirements
• Any errors in the Service will be corrected

Some jurisdictions do not allow the exclusion of implied warranties, so the above exclusions may not apply to you.`,
  },
  {
    title: "7. Limitation of Liability",
    content: `To the fullest extent permitted by applicable law, SCTD and its directors, employees, agents, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from:

• Your use of or inability to use the Service
• Any reliance on analysis results for business or financial decisions
• Loss of data, profits, or business opportunities
• Any third-party claims arising from your use of the Service

SCTD's total aggregate liability for any claims arising from your use of the Service shall not exceed the amount you paid to use the Service (which, if the Service was provided free of charge, is zero).`,
  },
  {
    title: "8. Intellectual Property",
    content: `All intellectual property in the Service — including but not limited to the user interface design, analysis algorithms, branding, and written content — is owned by or licensed to Sterling Carter Technology Distributors and is protected by applicable intellectual property laws.

You may not copy, reproduce, distribute, or create derivative works from any part of the Service without prior written permission from SCTD.`,
  },
  {
    title: "9. Changes to Terms",
    content: `SCTD reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Service. The date of the most recent revision will be noted at the top of this page. Your continued use of the Service after any changes constitutes your acceptance of the revised Terms.

We encourage you to review these Terms periodically.`,
  },
  {
    title: "10. Contact Information",
    content: `If you have questions about these Terms, please contact us:

Sterling Carter Technology Distributors
15A Lady Musgrave Road
St. Andrew, Kingston 5, JAMAICA

Email: info@sctdjm.com
Phone: (876) 968-6637

Office Hours: Monday–Friday, 8:00am–5:00pm Jamaica Standard Time`,
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Terms of Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Please read these terms carefully before using the SCTD Ink Coverage Estimator.
          </p>
          <p className="text-blue-300 text-sm mt-4">Last updated: March 2026</p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 space-y-5">

        {sections.map((s) => (
          <Card key={s.title} className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h2>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {s.content}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-blue-50 border-blue-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-blue-900 mb-1">Questions about these Terms?</h3>
            <p className="text-sm text-blue-700">
              Contact us at{" "}
              <a href="mailto:info@sctdjm.com" className="font-semibold underline">info@sctdjm.com</a>
              {" "}or call{" "}
              <a href="tel:+18769686637" className="font-semibold underline">(876) 968-6637</a>
            </p>
          </CardContent>
        </Card>

      </section>

      <Footer />
    </div>
  );
}
