import { PackageCard, type Package } from "./PackageCard";
import { AlertCircle } from "lucide-react";

interface PackagesSectionProps {
  packages: Package[];
  onAddToCart?: (pkg: Package) => void;
}

export function PackagesSection({ packages, onAddToCart }: PackagesSectionProps) {
  return (
    <section id="packages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div
          className="text-center mb-6 md:mb-8 bg-gradient-to-r from-transparent via-neon-yellow/20 to-transparent py-3 rounded-md border border-neon-yellow/30 mx-4"
          data-testid="banner-limited-offer"
        >
          <div className="flex items-center justify-center gap-2 text-neon-yellow font-bold text-sm md:text-base">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <span className="uppercase">LIMITED TIME OFFER – Save up to 11% instantly!</span>
          </div>
        </div>

        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-black text-center mb-12 md:mb-16 tracking-tight uppercase text-neon-yellow px-4"
          data-testid="text-section-title"
        >
          CHOOSE YOUR AECOIN PACKAGE
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 px-4">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}
