import { useState } from "react";
import { Menu, X, Phone, ChevronDown, MonitorCog } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/75 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/70 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-[70px] items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-2xl border border-transparent px-2 py-2 transition-all hover:border-green-100 hover:bg-green-50/70"
          >
            <img
              src={logoPath}
              alt="SCTD – Sterling Carter Technology Distributors"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-1 rounded-2xl border border-slate-200/70 bg-white/75 p-1 shadow-inner lg:flex">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                {link.children ? (
                  <>
                    <button
                      className={`flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                        link.children.some((c) => isActive(c.href))
                          ? "bg-green-600 text-white shadow-sm"
                          : "text-slate-700 hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180" />
                    </button>

                    <div className="invisible absolute left-0 top-full z-50 mt-3 w-64 translate-y-2 rounded-2xl border border-slate-200/80 bg-white/95 p-2 opacity-0 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="mb-1 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-green-700">
                        <MonitorCog className="h-3.5 w-3.5" />
                        {link.label}
                      </div>

                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                            isActive(child.href)
                              ? "bg-green-600 text-white"
                              : "text-slate-700 hover:bg-green-50 hover:text-green-700"
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
                    className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      isActive(link.href!)
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-slate-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href="tel:+18769686637"
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-green-200 hover:bg-green-50 hover:text-green-700"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Phone className="h-3.5 w-3.5" />
              </span>
              (876) 968-6637
            </a>

            <Link href="/#estimator">
              <button className="rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-lime-400 px-6 py-3 text-sm font-black text-white shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 hover:from-green-500 hover:via-green-400 hover:to-lime-300">
                Request Analysis
              </button>
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-2xl border border-slate-200 bg-white/80 p-2.5 text-slate-700 shadow-sm transition-all hover:bg-green-50 hover:text-green-700 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-2 shadow-inner">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === link.label ? null : link.label,
                          )
                        }
                        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-green-50 hover:text-green-700"
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openDropdown === link.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openDropdown === link.label && (
                        <div className="mb-2 ml-3 space-y-1 border-l-2 border-green-200 pl-3">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-green-50 hover:text-green-700"
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
                      className="block rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-green-50 hover:text-green-700"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-3xl border border-green-100 bg-green-50 p-3">
              <a
                href="tel:+18769686637"
                className="mb-3 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-green-700"
              >
                <Phone className="h-4 w-4" /> (876) 968-6637
              </a>

              <Link href="/#estimator" onClick={() => setMobileOpen(false)}>
                <button className="w-full rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-lime-400 px-5 py-3 text-sm font-black text-white shadow-lg">
                  Request Analysis
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
