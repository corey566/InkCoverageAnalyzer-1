import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
      <div className="bg-gray-900 border-t border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

            {/* Icon + text */}
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">Cookie Preferences</p>
                <p className="text-gray-400 text-xs leading-relaxed max-w-2xl">
                  We use essential cookies only to keep this application working. We do not use advertising, tracking, or analytics cookies.
                  No document data or personal information is ever stored.{" "}
                  <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
                    Privacy Policy
                  </Link>{" "}
                  &middot;{" "}
                  <Link href="/terms-of-service" className="text-blue-400 hover:text-blue-300 underline">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={handleDeny}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-xs h-8 px-4"
              >
                Deny Non-Essential
              </Button>
              <Button
                onClick={handleAccept}
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 px-4 font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Allow Essential
              </Button>
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-gray-300 p-1 ml-1"
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
