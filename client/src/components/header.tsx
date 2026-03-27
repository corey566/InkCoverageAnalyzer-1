import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "wouter";
import logoPath from "@assets/image_1774596436652.png";

export function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavLinks = () => (
    <>
      <Link href="/" className="text-primary font-medium hover:text-primary/80 transition-colors">
        Home
      </Link>
      <button
        onClick={() => scrollToSection('estimator')}
        className="text-gray-600 hover:text-primary transition-colors"
      >
        Estimator
      </button>
      <button
        onClick={() => scrollToSection('results')}
        className="text-gray-600 hover:text-primary transition-colors"
      >
        Reports
      </button>
      <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
        Support
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src={logoPath}
              alt="SCTD - Sterling Carter Technology Distributors"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLinks />
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mb-6 mt-2">
                <img
                  src={logoPath}
                  alt="SCTD"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <nav className="flex flex-col space-y-4">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
