import { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
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
    <footer style={{ background: "#0c2318" }} className="text-white">

      {/* Newsletter row */}
      <div style={{ background: "#0e2a1e" }} className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={logoPath}
              alt="SCTD"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <div className="hidden sm:block w-px h-8 bg-white/15" />
            <p className="text-sm font-semibold text-white">Subscribe to our newsletter</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full md:w-64 px-4 py-2.5 rounded-full text-sm text-gray-900 bg-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="submit"
              className="flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
              style={{ background: "hsl(133, 55%, 40%)" }}
              onMouseOver={e => (e.currentTarget.style.background = "hsl(133, 55%, 34%)")}
              onMouseOut={e => (e.currentTarget.style.background = "hsl(133, 55%, 40%)")}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* About */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">About</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Professional printing solutions and technology services for businesses across Jamaica and the Caribbean. Powered by Ghostscript analysis.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 text-gray-400 hover:text-white hover:border-white/50 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Links</h4>
            <ul className="space-y-3">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 text-sm hover:text-green-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Working Hours</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <p className="text-white font-medium mb-0.5">Monday – Friday</p>
                <p>8:00 AM – 5:00 PM</p>
              </div>
              <div>
                <p className="text-white font-medium mb-0.5">Saturday</p>
                <p>9:00 AM – 1:00 PM</p>
              </div>
              <div>
                <p className="text-white font-medium mb-0.5">Sunday</p>
                <p>Closed</p>
              </div>
            </div>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Get In Touch</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-400" />
                <span>15A Lady Musgrave Road<br />Kingston 5, Jamaica</span>
              </div>
              <a href="mailto:info@sctdjm.com" className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors group">
                <Mail className="w-4 h-4 flex-shrink-0 text-green-400" />
                info@sctdjm.com
              </a>
              <a href="tel:+18769686637" className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors group">
                <Phone className="w-4 h-4 flex-shrink-0 text-green-400" />
                (876) 968-6637
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: "#081a10" }} className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Sterling Carter Technology Distributors. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
