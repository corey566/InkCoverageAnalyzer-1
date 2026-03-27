import { useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoPath from "@assets/image_1774596436652.png";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    children: [
      { label: "Ink Coverage Estimator", href: "/" },
      { label: "Print Management", href: "/print-management" },
      { label: "Cost Analysis Tools", href: "/cost-analysis" },
      { label: "Enterprise Solutions", href: "/enterprise" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "Documentation", href: "/documentation" },
      { label: "Training", href: "/training" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [location] = useLocation();

  const isActive = (href: string) => location === href;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#0d2137] text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <p className="text-xs text-gray-300">Professional Ink Coverage Analysis for Print Shops & Businesses</p>
          <div className="flex items-center gap-5 text-xs text-gray-300">
            <a href="mailto:info@sctdjm.com" className="hover:text-white transition-colors">info@sctdjm.com</a>
            <span className="text-gray-600">|</span>
            <a href="tel:+18769686637" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3 h-3" /> (876) 968-6637
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src={logoPath}
              alt="SCTD – Sterling Carter Technology Distributors"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                {link.children ? (
                  <>
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        link.children.some(c => isActive(c.href))
                          ? "text-green-700 bg-green-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 text-sm transition-colors ${
                            isActive(child.href)
                              ? "text-green-700 bg-green-50 font-medium"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href!}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href!)
                        ? "text-green-700 bg-green-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/#estimator">
              <button className="btn-primary">
                Try the Estimator
              </button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                      className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`} />
                    </button>
                    {openDropdown === link.label && (
                      <div className="ml-4 mt-1 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href!}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100">
              <a href="tel:+18769686637" className="flex items-center gap-2 px-3 py-2 text-sm text-green-700 font-medium">
                <Phone className="w-4 h-4" /> (876) 968-6637
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
