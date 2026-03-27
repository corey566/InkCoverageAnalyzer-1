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
    <header className="bg-white sticky top-0 z-50" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src={logoPath}
              alt="SCTD – Sterling Carter Technology Distributors"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                {link.children ? (
                  <>
                    <button
                      className={`flex items-center gap-1 px-4 py-2.5 text-sm font-medium transition-colors rounded-md ${
                        link.children.some(c => isActive(c.href))
                          ? "text-green-700"
                          : "text-gray-700 hover:text-green-700"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.06)" }}>
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 text-sm transition-colors ${
                            isActive(child.href)
                              ? "text-green-700 bg-green-50 font-medium"
                              : "text-gray-700 hover:bg-green-50 hover:text-green-700"
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
                    className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.href!)
                        ? "text-green-700"
                        : "text-gray-700 hover:text-green-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA group */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="tel:+18769686637"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50">
                <Phone className="w-3.5 h-3.5 text-green-700" />
              </span>
              (876) 968-6637
            </a>
            <Link href="/#estimator">
              <button className="btn-primary text-sm px-6 py-2.5">
                Request Analysis
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
                      className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
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
                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <a href="tel:+18769686637" className="flex items-center gap-2 px-3 py-2 text-sm text-green-700 font-medium">
                <Phone className="w-4 h-4" /> (876) 968-6637
              </a>
              <Link href="/#estimator" onClick={() => setMobileOpen(false)}>
                <button className="btn-primary w-full justify-center">Request Analysis</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
