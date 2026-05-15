import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieConsentBanner } from "@/components/cookie-consent";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArrowLeft, Home as HomeIcon, SearchX } from "lucide-react";
import Home from "@/pages/home";
import PrintManagement from "@/pages/print-management";
import CostAnalysis from "@/pages/cost-analysis";
import Enterprise from "@/pages/enterprise";
import Documentation from "@/pages/documentation";
import Training from "@/pages/training";
import Contact from "@/pages/contact";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 42%, #ecfeff 100%)",
        }}
      >
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.24]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(22,163,74,0.18) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto mb-8 flex h-56 w-56 items-center justify-center rounded-[2.5rem] border border-white/80 bg-white/75 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-100 via-lime-50 to-cyan-100 animate-pulse" />

              <div className="absolute left-1/2 top-6 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-[2rem] border-4 border-green-200 bg-white shadow-lg">
                <SearchX className="h-12 w-12 text-green-700" />
              </div>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500 animate-bounce" />
                <span className="h-3 w-3 rounded-full bg-lime-400 animate-bounce [animation-delay:120ms]" />
                <span className="h-3 w-3 rounded-full bg-cyan-400 animate-bounce [animation-delay:240ms]" />
              </div>
            </div>
          </div>

          <p className="mb-4 inline-flex items-center justify-center rounded-2xl border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-700 shadow-sm backdrop-blur">
            404 — Page Not Found
          </p>

          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Oops, this page went missing
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            The page you are looking for may have been moved, renamed, or does
            not exist. Let’s get you back to the estimator.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-600 via-green-500 to-lime-400 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-green-100 transition-all hover:-translate-y-0.5">
                <HomeIcon className="h-4 w-4" />
                Back to Home
              </button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-green-200 bg-white/75 px-7 py-3.5 text-sm font-black text-green-700 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-green-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/print-management" component={PrintManagement} />
      <Route path="/cost-analysis" component={CostAnalysis} />
      <Route path="/enterprise" component={Enterprise} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/training" component={Training} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <CookieConsentBanner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
