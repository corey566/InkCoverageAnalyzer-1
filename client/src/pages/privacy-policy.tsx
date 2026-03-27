import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Lock, Trash2, Eye, Server, Mail } from "lucide-react";

const highlights = [
  {
    icon: <Trash2 className="w-6 h-6 text-green-600" />,
    title: "No Document Retention",
    description: "Uploaded files are processed in a temporary directory and permanently deleted after analysis. We do not store, archive, or index document content.",
  },
  {
    icon: <Lock className="w-6 h-6 text-blue-600" />,
    title: "No Personal Data Collected",
    description: "We do not collect your name, email address, or any personally identifiable information. No account registration is required or offered.",
  },
  {
    icon: <Eye className="w-6 h-6 text-purple-600" />,
    title: "No Tracking or Analytics",
    description: "We do not use third-party analytics, advertising trackers, or cookies beyond those strictly necessary for the application to function.",
  },
  {
    icon: <Server className="w-6 h-6 text-orange-600" />,
    title: "No Third-Party Sharing",
    description: "Your documents and usage data are never shared with, sold to, or processed by any third-party service providers.",
  },
];

const sections = [
  {
    title: "1. Overview",
    content: `This Privacy Policy describes how Sterling Carter Technology Distributors ("SCTD", "we", "our", or "us") handles information when you use the SCTD Ink Coverage Estimator (the "Service"). We are committed to protecting your privacy and processing your documents with the highest level of confidentiality.

Our fundamental principle: we do not retain any document you upload, any analysis result tied to your identity, or any personal information about you.`,
  },
  {
    title: "2. Information We Process",
    content: `When you upload a document for analysis, that document is:

• Temporarily stored on our server while being processed
• Analysed using Ghostscript and/or ImageMagick to extract ink coverage data
• Immediately deleted from the server after the analysis is complete

The only data we retain in our database is the analysis result itself (ink coverage percentages and cost estimates) — without any link to your identity, IP address, or session. This data is anonymised by design.

We do not collect:
• Your name, email address, or contact details
• Your IP address (beyond standard server logs which are not retained)
• Browser fingerprints, cookies, or device identifiers
• Any metadata embedded in your uploaded documents`,
  },
  {
    title: "3. Document Confidentiality",
    content: `We understand that the documents you upload for analysis may contain sensitive business information, client data, or proprietary designs. Our commitment is absolute:

• No employee or contractor of SCTD accesses your document content
• Documents are processed exclusively by automated software
• No backup copies of uploaded documents are made
• Document content is never indexed, scanned for keywords, or used for any purpose other than calculating ink coverage percentages

You should feel confident uploading confidential business documents, legal materials, or sensitive creative work.`,
  },
  {
    title: "4. Cookies and Local Storage",
    content: `The Service uses minimal browser storage:

• Session-related data (such as analysis IDs) may be temporarily stored in your browser session memory. This data is not sent to any third party and is cleared when you close the browser tab.
• We do not use advertising cookies, tracking pixels, or persistent identifiers.
• No cookie consent banner is displayed because we do not use non-essential cookies.`,
  },
  {
    title: "5. Data Security",
    content: `We implement appropriate technical measures to protect the data we process:

• All data in transit is protected by HTTPS/TLS encryption
• Uploaded files are stored in a restricted server directory not accessible to the public web
• File names are randomised to prevent enumeration
• Files are deleted immediately after processing

While no internet transmission is 100% secure, we take reasonable precautions to protect your documents during the brief period they exist on our servers.`,
  },
  {
    title: "6. Children's Privacy",
    content: `The Service is not directed to children under the age of 13. We do not knowingly collect any information from children. If you believe a child has submitted information through the Service, please contact us and we will take immediate steps to delete it.`,
  },
  {
    title: "7. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. The date of the most recent revision will be noted at the top of this page. We encourage you to review this page periodically. Continued use of the Service after any changes constitutes your acceptance of the revised policy.`,
  },
  {
    title: "8. Contact Us",
    content: `If you have questions about this Privacy Policy or our data practices, please contact us:

Sterling Carter Technology Distributors
15A Lady Musgrave Road
St. Andrew, Kingston 5, JAMAICA

Email: info@sctdjm.com
Phone: (876) 968-6637

We will respond to all privacy-related enquiries within 5 business days.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-medium">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Privacy Matters</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            No user data is retained. No personal information is collected. Your documents are yours alone.
          </p>
          <p className="text-blue-300 text-sm mt-4">Last updated: March 2026</p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 space-y-10">

        {/* Key highlights */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Privacy Commitments</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {highlights.map((h) => (
              <Card key={h.title} className="border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {h.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{h.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{h.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Full policy */}
        <div className="space-y-6">
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
        </div>

        {/* Contact footer */}
        <Card className="bg-blue-50 border-blue-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-blue-900 mb-1">Privacy Questions?</h3>
            <p className="text-sm text-blue-700 mb-3">
              Contact us directly at{" "}
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
