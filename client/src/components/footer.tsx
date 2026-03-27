import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
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

export function Footer() {
  return (
    <footer style={{ background: "#0a1e30" }} className="text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src={logoPath}
              alt="SCTD"
              className="h-9 w-auto object-contain brightness-0 invert mb-5"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Professional printing solutions and technology services for businesses across Jamaica and the Caribbean.
            </p>
            <div className="space-y-2.5 text-sm">
              <a href="mailto:info@sctdjm.com" className="flex items-center gap-2.5 text-gray-400 hover:text-green-400 transition-colors group">
                <Mail className="w-4 h-4 flex-shrink-0" />
                info@sctdjm.com
              </a>
              <a href="tel:+18769686637" className="flex items-center gap-2.5 text-gray-400 hover:text-green-400 transition-colors group">
                <Phone className="w-4 h-4 flex-shrink-0" />
                (876) 968-6637
              </a>
              <div className="flex items-start gap-2.5 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>15A Lady Musgrave Road<br />Kingston 5, JAMAICA</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Products</h4>
            <ul className="space-y-3">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 text-sm hover:text-green-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 text-sm hover:text-green-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Working hours */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Working Hours</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <p className="text-white font-medium mb-1">Monday – Friday</p>
                <p>8:00 AM – 5:00 PM</p>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Saturday</p>
                <p>9:00 AM – 1:00 PM</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500">Jamaica Standard Time (UTC-5)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: "#061525" }} className="border-t border-white/5">
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
