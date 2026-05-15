import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Headphones,
  Bug,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const supportTopics = [
  {
    icon: <Headphones className="h-5 w-5 text-green-700" />,
    title: "General Support",
    description:
      "Questions about using the platform, understanding results, or account issues.",
  },
  {
    icon: <Bug className="h-5 w-5 text-red-500" />,
    title: "Bug Reports",
    description:
      "Found something that isn't working correctly? Let us know and we'll investigate.",
  },
  {
    icon: <HelpCircle className="h-5 w-5 text-purple-500" />,
    title: "Technical Questions",
    description:
      "Questions about the analysis methodology, cost formulas, or file compatibility.",
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-green-700" />,
    title: "Enterprise Enquiries",
    description:
      "Interested in a custom deployment, white-label version, or enterprise support contract.",
  },
];

const contactDetails = [
  {
    icon: <MapPin className="h-5 w-5 text-green-700" />,
    label: "Address",
    content: (
      <p className="text-sm text-slate-600">
        15A Lady Musgrave Road
        <br />
        St. Andrew, Kingston 5
        <br />
        JAMAICA
      </p>
    ),
  },
  {
    icon: <Mail className="h-5 w-5 text-green-700" />,
    label: "Email",
    content: (
      <div>
        <a
          href="mailto:info@sctdjm.com"
          className="text-sm font-bold text-green-700 hover:underline"
        >
          info@sctdjm.com
        </a>
        <p className="mt-0.5 text-xs text-slate-400">
          We respond within 1 business day
        </p>
      </div>
    ),
  },
  {
    icon: <Phone className="h-5 w-5 text-green-700" />,
    label: "Phone",
    content: (
      <div>
        <a
          href="tel:+18769686637"
          className="text-sm font-bold text-green-700 hover:underline"
        >
          (876) 968-6637
        </a>
        <p className="mt-0.5 text-xs text-slate-400">
          Mon–Fri, 8am–5pm Jamaica Time
        </p>
      </div>
    ),
  },
  {
    icon: <Clock className="h-5 w-5 text-green-700" />,
    label: "Business Hours",
    content: (
      <div>
        <p className="text-sm text-slate-700">
          Monday – Friday: 8:00am – 5:00pm
        </p>
        <p className="text-sm text-slate-700">Saturday: 9:00am – 1:00pm</p>
        <p className="mt-0.5 text-xs text-slate-400">
          Jamaica Standard Time (UTC-5)
        </p>
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
    const mailto = `mailto:info@sctdjm.com?subject=${encodeURIComponent(
      subject || "Support Request",
    )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailto;
    toast({
      title: "Opening email client",
      description:
        "Your default email app will open with the message pre-filled.",
    });
  };

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
            <span className="text-white/70">Contact</span>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300 backdrop-blur">
            <Headphones className="h-4 w-4" />
            Contact Support
          </div>

          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
            We're Here to Help
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-green-50/75">
            Reach out to the Sterling Carter Technology Distributors support
            team. We typically respond within one business day.
          </p>
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

        <div className="relative mx-auto max-w-5xl px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <p className="mb-2 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
                  Reach Us
                </p>
                <h2 className="mb-6 text-2xl font-black text-slate-950">
                  Contact Information
                </h2>

                <div className="space-y-4">
                  {contactDetails.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-4 rounded-[1.5rem] border border-white/80 bg-white/75 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl"
                    >
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-green-100">
                        {item.icon}
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-black text-slate-950">
                          {item.label}
                        </p>
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-base font-black text-slate-950">
                  What Can We Help With?
                </h2>

                <div className="space-y-3">
                  {supportTopics.map((t) => (
                    <div
                      key={t.title}
                      className="flex items-start gap-3 rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-green-50">
                        {t.icon}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          {t.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                          {t.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl md:p-8">
                <div className="mb-1 flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100">
                    <MessageSquare className="h-5 w-5 text-green-700" />
                  </div>
                  <h2 className="text-base font-black text-slate-950">
                    Send Us a Message
                  </h2>
                </div>

                <p className="mb-6 text-sm text-slate-400">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500"
                    >
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      required
                      className="h-11 rounded-2xl border-2 border-slate-100 bg-white"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      required
                      className="h-11 rounded-2xl border-2 border-slate-100 bg-white"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="subject"
                      className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500"
                    >
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Question about CMYK analysis"
                      className="h-11 rounded-2xl border-2 border-slate-100 bg-white"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="message"
                      className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your question or issue in detail..."
                      className="min-h-[150px] rounded-2xl border-2 border-slate-100 bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-600 via-green-500 to-lime-400 py-3 text-sm font-black text-white shadow-xl shadow-green-100 transition-all hover:-translate-y-0.5"
                  >
                    <Mail className="h-4 w-4" />
                    Send Message
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    This will open your email client with the message
                    pre-filled.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
