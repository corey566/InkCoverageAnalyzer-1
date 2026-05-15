import { useState, useEffect } from "react";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const COOKIE_KEY = "sctd_cookie_consent";

export type CookieConsent = "accepted" | "denied" | null;

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const handleDeny = () => {
    localStorage.setItem(COOKIE_KEY, "denied");
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(COOKIE_KEY, "denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-bottom-4 fade-in duration-300 sm:bottom-5 sm:right-5">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-green-200/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-cyan-200/60 blur-2xl" />

        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 z-10 rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative pr-8">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-lime-400 shadow-lg shadow-green-100">
              <Cookie className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-black text-slate-950">
                Cookie Preferences
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                We use essential cookies only to keep this application working.
                No advertising, tracking, analytics, document data, or personal
                information is stored.
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-2xl border border-green-100 bg-green-50/70 px-3 py-2 text-xs leading-relaxed text-green-800">
            <Link
              href="/privacy-policy"
              className="font-bold text-green-700 underline underline-offset-2 hover:text-green-600"
            >
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link
              href="/terms-of-service"
              className="font-bold text-green-700 underline underline-offset-2 hover:text-green-600"
            >
              Terms of Service
            </Link>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleDeny}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Deny Non-Essential
            </button>

            <button
              onClick={handleAccept}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-lime-400 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-green-100 transition-all hover:-translate-y-0.5"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Allow Essential
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
