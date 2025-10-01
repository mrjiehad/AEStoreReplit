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
          className="text-center mb-4 bg-gradient-to-r from-transparent via-neon-yellow/20 to-transparent py-3 rounded-md border border-neon-yellow/30"
          data-testid="banner-limited-offer"
        >
          <div className="flex items-center justify-center gap-2 text-neon-yellow font-bold">
            <AlertCircle className="w-5 h-5" />
            <span>LIMITED TIME OFFER – Save up to 11% instantly!</span>
          </div>
        </div>

        <h2
          className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-16 tracking-wide"
          style={{
            color: "#FFD700",
            textShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
          }}
          data-testid="text-section-title"
        >
          CHOOSE YOUR AECOIN PACKAGE
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}
