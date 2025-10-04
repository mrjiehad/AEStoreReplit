import { PackageCard } from "./PackageCard";
import type { Package } from "./PackageCard";

interface PackagesSectionProps {
  packages: Package[];
  onAddToCart?: (pkg: Package) => void;
}

export function PackagesSection({ packages, onAddToCart }: PackagesSectionProps) {
  // Ensure packages is an array
  const safePackages = Array.isArray(packages) ? packages : [];

  return (
    <section id="packages" className="min-h-screen bg-[#000000] flex items-center py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-3">
          <span className="text-neon-yellow font-rajdhani font-semibold text-sm tracking-widest uppercase">
            PREMIUM CURRENCY
          </span>
        </div>

        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-bebas text-center mb-4 tracking-wider uppercase text-white"
          data-testid="text-section-title"
        >
          CHOOSE YOUR POWER
        </h2>

        <p className="text-center text-gray-300 font-rajdhani text-lg mb-8 max-w-3xl mx-auto">
          Unlock the full potential of Los Santos with our instant AECOIN packages
        </p>

        <div
          className="text-center mb-12 bg-neon-yellow/10 border border-neon-yellow/30 py-3 mx-auto max-w-2xl"
          data-testid="banner-limited-offer"
        >
          <span className="text-neon-yellow font-rajdhani font-bold text-sm uppercase tracking-wide">
            LIMITED TIME - BONUS AECOIN ON ALL PACKAGES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {safePackages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} onAddToCart={onAddToCart} />
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-400 font-rajdhani mb-4">
            Need a custom package? Contact our team for bulk discounts
          </p>
          <button className="border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 font-rajdhani font-bold uppercase text-sm px-8 h-12 transition-colors">
            CONTACT SALES
          </button>
        </div>
      </div>
    </section>
  );
}
