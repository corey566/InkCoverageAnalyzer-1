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
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="border-t border-white/10 shadow-2xl" style={{ background: "#0c2318" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

            {/* Icon + text */}
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "hsl(133, 55%, 40%)" }}>
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">Cookie Preferences</p>
                <p className="text-gray-400 text-xs leading-relaxed max-w-2xl">
                  We use essential cookies only to keep this application working. We do not use advertising, tracking, or analytics cookies. No document data or personal information is ever stored.{" "}
                  <Link href="/privacy-policy" className="text-green-400 hover:text-green-300 underline">
                    Privacy Policy
                  </Link>{" "}
                  &middot;{" "}
                  <Link href="/terms-of-service" className="text-green-400 hover:text-green-300 underline">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleDeny}
                className="px-4 py-1.5 text-xs font-medium rounded-full border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                Deny Non-Essential
              </button>
              <button
                onClick={handleAccept}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full text-white transition-all"
                style={{ background: "hsl(133, 55%, 40%)" }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Allow Essential
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-gray-300 p-1 ml-1 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
