import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieConsentBanner } from "@/components/cookie-consent";
import Home from "@/pages/home";
import PrintManagement from "@/pages/print-management";
import CostAnalysis from "@/pages/cost-analysis";
import Enterprise from "@/pages/enterprise";
import Documentation from "@/pages/documentation";
import Training from "@/pages/training";
import Contact from "@/pages/contact";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";

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
      <Route>
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      </Route>
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
