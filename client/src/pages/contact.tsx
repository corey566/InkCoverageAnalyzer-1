import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, MessageSquare, Headphones, Bug, HelpCircle, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const supportTopics = [
  {
    icon: <Headphones className="w-5 h-5" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "General Support",
    description: "Questions about using the platform, understanding results, or account issues.",
  },
  {
    icon: <Bug className="w-5 h-5 text-red-500" />,
    title: "Bug Reports",
    description: "Found something that isn't working correctly? Let us know and we'll investigate.",
  },
  {
    icon: <HelpCircle className="w-5 h-5 text-purple-500" />,
    title: "Technical Questions",
    description: "Questions about the analysis methodology, cost formulas, or file compatibility.",
  },
  {
    icon: <MessageSquare className="w-5 h-5" style={{ color: "hsl(133, 48%, 36%)" }} />,
    title: "Enterprise Enquiries",
    description: "Interested in a custom deployment, white-label version, or enterprise support contract.",
  },
];

const contactDetails = [
  {
    icon: <MapPin className="w-5 h-5" style={{ color: "hsl(133, 48%, 36%)" }} />,
    bg: "bg-green-50",
    label: "Address",
    content: <p className="text-gray-600 text-sm">15A Lady Musgrave Road<br />St. Andrew, Kingston 5<br />JAMAICA</p>,
  },
  {
    icon: <Mail className="w-5 h-5" style={{ color: "hsl(133, 48%, 36%)" }} />,
    bg: "bg-green-50",
    label: "Email",
    content: (
      <div>
        <a href="mailto:info@sctdjm.com" className="text-sm font-medium hover:underline" style={{ color: "hsl(133, 48%, 36%)" }}>info@sctdjm.com</a>
        <p className="text-gray-400 text-xs mt-0.5">We respond within 1 business day</p>
      </div>
    ),
  },
  {
    icon: <Phone className="w-5 h-5" style={{ color: "hsl(133, 48%, 36%)" }} />,
    bg: "bg-green-50",
    label: "Phone",
    content: (
      <div>
        <a href="tel:+18769686637" className="text-sm font-medium hover:underline" style={{ color: "hsl(133, 48%, 36%)" }}>(876) 968-6637</a>
        <p className="text-gray-400 text-xs mt-0.5">Mon–Fri, 8am–5pm Jamaica Time</p>
      </div>
    ),
  },
  {
    icon: <Clock className="w-5 h-5" style={{ color: "hsl(133, 48%, 36%)" }} />,
    bg: "bg-green-50",
    label: "Business Hours",
    content: (
      <div>
        <p className="text-gray-700 text-sm">Monday – Friday: 8:00am – 5:00pm</p>
        <p className="text-gray-700 text-sm">Saturday: 9:00am – 1:00pm</p>
        <p className="text-gray-400 text-xs mt-0.5">Jamaica Standard Time (UTC-5)</p>
      </div>
    ),
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:info@sctdjm.com?subject=${encodeURIComponent(subject || "Support Request")}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailto;
    toast({ title: "Opening email client", description: "Your default email app will open with the message pre-filled." });
  };

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
            <span className="text-white/70">Contact</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/10">
            <Headphones className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">Contact Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">We're Here to Help</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(133, 30%, 75%)" }}>
            Reach out to the Sterling Carter Technology Distributors support team. We typically respond within one business day.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <p className="section-label mb-2">Reach Us</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                {contactDetails.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                  >
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">{item.label}</p>
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support topics */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">What Can We Help With?</h2>
              <div className="space-y-3">
                {supportTopics.map((t) => (
                  <div
                    key={t.title}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  >
                    <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      {t.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <div
              className="bg-white rounded-2xl border border-gray-100 p-8"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(133, 48%, 94%)" }}>
                  <MessageSquare className="w-5 h-5" style={{ color: "hsl(133, 48%, 36%)" }} />
                </div>
                <h2 className="text-base font-bold text-gray-900">Send Us a Message</h2>
              </div>
              <p className="text-sm text-gray-400 mb-6">Fill out the form below and we'll get back to you as soon as possible.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Your Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" required className="rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" required className="rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Subject</Label>
                  <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Question about CMYK analysis" className="rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Message</Label>
                  <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your question or issue in detail..." className="min-h-[140px] rounded-xl" required />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-white text-sm transition-all"
                  style={{ background: "hsl(133, 55%, 40%)", boxShadow: "0 4px 16px rgba(46,160,80,0.30)" }}
                >
                  <Mail className="w-4 h-4" />
                  Send Message
                </button>
                <p className="text-xs text-gray-400 text-center">
                  This will open your email client with the message pre-filled.
                </p>
              </form>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
