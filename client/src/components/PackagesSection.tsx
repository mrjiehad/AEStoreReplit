import { PackageCard } from "./PackageCard";
import type { Package } from "./PackageCard";

interface PackagesSectionProps {
  packages: Package[];
  onAddToCart?: (pkg: Package) => void;
}

export function PackagesSection({ packages, onAddToCart }: PackagesSectionProps) {
  return (
    <section id="packages" className="py-20 bg-[#0d1d35]">
      <div className="container mx-auto px-4">
        {/* Section Label */}
        <div className="text-center mb-3">
          <span className="text-neon-yellow font-rajdhani font-semibold text-sm tracking-widest uppercase">
            PREMIUM CURRENCY
          </span>
        </div>

        {/* Section Title */}
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bebas text-center mb-4 tracking-wider uppercase text-white"
          data-testid="text-section-title"
        >
          CHOOSE YOUR POWER
        </h2>

        {/* Section Subtitle */}
        <p className="text-center text-gray-300 font-rajdhani text-lg mb-8 max-w-3xl mx-auto">
          Unlock the full potential of Los Santos with our instant AECOIN packages
        </p>

        {/* Limited Time Banner */}
        <div
          className="text-center mb-12 bg-neon-yellow/10 border border-neon-yellow/30 py-3 rounded-sm mx-auto max-w-2xl"
          data-testid="banner-limited-offer"
        >
          <span className="text-neon-yellow font-rajdhani font-bold text-sm uppercase tracking-wide">
            LIMITED TIME - BONUS AECOIN ON ALL PACKAGES
          </span>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} onAddToCart={onAddToCart} />
          ))}
        </div>

        {/* Contact Sales */}
        <div className="text-center">
          <p className="text-gray-400 font-rajdhani mb-4">
            Need a custom package? Contact our team for bulk discounts
          </p>
          <button className="border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 font-rajdhani font-bold uppercase text-sm px-8 h-12 rounded-sm transition-colors">
            CONTACT SALES
          </button>
        </div>
      </div>
    </section>
  );
}
