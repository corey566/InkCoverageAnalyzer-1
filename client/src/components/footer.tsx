import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";
import { Link } from "wouter";
import logoPath from "@assets/image_1774596436652.png";

const productLinks = [
  { label: "Ink Coverage Estimator", href: "/" },
  { label: "Print Management", href: "/print-management" },
  { label: "Cost Analysis Tools", href: "/cost-analysis" },
  { label: "Enterprise Solutions", href: "/enterprise" },
];

const supportLinks = [
  { label: "Documentation", href: "/documentation" },
  { label: "Training Centre", href: "/training" },
  { label: "Contact Support", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(135deg, #06180c 0%, #0a2a17 52%, #051108 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />

      <div className="relative border-b border-white/10 bg-white/[0.04] backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-7 md:flex-row">
          <div className="flex items-center gap-5">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <img
                src={logoPath}
                alt="SCTD"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-green-300">
                Newsletter
              </p>
              <p className="text-sm text-white/70">
                Get print cost tips and product updates.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full flex-col gap-3 rounded-3xl border border-white/10 bg-black/15 p-2 backdrop-blur sm:flex-row md:w-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-green-400 sm:w-72"
              required
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-lime-400 px-6 text-sm font-black text-white shadow-lg shadow-green-950/30 transition-all hover:-translate-y-0.5"
            >
              Subscribe <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
            <h4 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-green-300">
              About
            </h4>
            <p className="mb-6 text-sm leading-relaxed text-white/65">
              Professional printing solutions and technology services for
              businesses across Jamaica and the Caribbean. Powered by{" "}
              <a
                href="https://orianwave.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-300 hover:text-green-200 underline"
              >
                OrianWave
              </a>
              .
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/55 transition-all hover:-translate-y-0.5 hover:border-green-300/40 hover:bg-green-400/10 hover:text-green-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
            <h4 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-green-300">
              Products
            </h4>
            <ul className="space-y-2">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-white/65 transition-all hover:bg-white/8 hover:text-green-300"
                  >
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
            <h4 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-green-300">
              Support
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-white/65 transition-all hover:bg-white/8 hover:text-green-300"
                  >
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
            <h4 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-green-300">
              Get In Touch
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 rounded-2xl bg-black/10 p-3 text-white/65">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-300" />
                <span>
                  15A Lady Musgrave Road
                  <br />
                  Kingston 5, Jamaica
                </span>
              </div>
              <a
                href="mailto:info@sctdjm.com"
                className="flex items-center gap-3 rounded-2xl bg-black/10 p-3 text-white/65 transition-all hover:text-green-300"
              >
                <Mail className="h-4 w-4 shrink-0 text-green-300" />
                info@sctdjm.com
              </a>
              <a
                href="tel:+18769686637"
                className="flex items-center gap-3 rounded-2xl bg-black/10 p-3 text-white/65 transition-all hover:text-green-300"
              >
                <Phone className="h-4 w-4 shrink-0 text-green-300" />
                (876) 968-6637
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 md:flex-row">
          <p className="text-center text-xs text-white/45 md:text-left">
            &copy; {new Date().getFullYear()} Sterling Carter Technology
            Distributors. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs">
            <Link
              href="/privacy-policy"
              className="text-white/45 transition-colors hover:text-green-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-white/45 transition-colors hover:text-green-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
