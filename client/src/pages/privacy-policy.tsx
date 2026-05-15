import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Lock, Trash2, Eye, Server, Mail } from "lucide-react";

const highlights = [
  {
    icon: <Trash2 className="h-6 w-6 text-green-600" />,
    title: "No Document Retention",
    description:
      "Uploaded files are processed in a temporary directory and permanently deleted after analysis. We do not store, archive, or index document content.",
  },
  {
    icon: <Lock className="h-6 w-6 text-blue-600" />,
    title: "No Personal Data Collected",
    description:
      "We do not collect your name, email address, or any personally identifiable information. No account registration is required or offered.",
  },
  {
    icon: <Eye className="h-6 w-6 text-purple-600" />,
    title: "No Tracking or Analytics",
    description:
      "We do not use third-party analytics, advertising trackers, or cookies beyond those strictly necessary for the application to function.",
  },
  {
    icon: <Server className="h-6 w-6 text-orange-600" />,
    title: "No Third-Party Sharing",
    description:
      "Your documents and usage data are never shared with, sold to, or processed by any third-party service providers.",
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

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center md:py-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300 backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            Privacy Policy
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
            Your Privacy Matters
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-green-50/75">
            No user data is retained. No personal information is collected. Your
            documents are yours alone.
          </p>
          <p className="mt-4 text-sm text-green-300/70">
            Last updated: March 2026
          </p>
        </div>
      </section>

      <section
        className="relative overflow-hidden py-16"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 42%, #ecfeff 100%)",
        }}
      >
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-4xl space-y-10 px-4">
          <div>
            <h2 className="mb-6 text-center text-2xl font-black text-slate-950">
              Our Privacy Commitments
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {highlights.map((h) => (
                <Card
                  key={h.title}
                  className="rounded-[1.75rem] border border-white/80 bg-white/75 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-green-200"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-green-50">
                        {h.icon}
                      </div>
                      <div>
                        <h3 className="mb-1 font-black text-slate-950">
                          {h.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-600">
                          {h.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {sections.map((s) => (
              <Card
                key={s.title}
                className="rounded-[1.75rem] border border-white/80 bg-white/75 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <CardContent className="p-6">
                  <h2 className="mb-3 text-lg font-black text-slate-950">
                    {s.title}
                  </h2>
                  <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {s.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-[2rem] border border-green-200 bg-gradient-to-br from-green-50 to-lime-50 shadow-lg shadow-green-100/50">
            <CardContent className="p-6 text-center">
              <Mail className="mx-auto mb-3 h-8 w-8 text-green-700" />
              <h3 className="mb-1 font-black text-green-950">
                Privacy Questions?
              </h3>
              <p className="text-sm text-green-800">
                Contact us directly at{" "}
                <a
                  href="mailto:info@sctdjm.com"
                  className="font-black underline"
                >
                  info@sctdjm.com
                </a>{" "}
                or call{" "}
                <a href="tel:+18769686637" className="font-black underline">
                  (876) 968-6637
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
