import { PackageCard } from "./PackageCard";
import type { Package } from "./PackageCard";
import { Flame, Star, Zap } from "lucide-react";

interface PackagesSectionProps {
  packages: Package[];
  onAddToCart?: (pkg: Package) => void;
}

export function PackagesSection({ packages, onAddToCart }: PackagesSectionProps) {
  return (
    <section id="packages" className="min-h-screen bg-gradient-to-br from-black via-[#0d1d35] to-black flex items-center py-20 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)',
        backgroundSize: '100px 100px',
      }} />
      
      {/* Floating Elements */}
      <Star className="absolute top-20 right-20 w-16 h-16 text-neon-yellow/10 animate-float fill-current" />
      <Flame className="absolute bottom-40 left-10 w-20 h-20 text-neon-yellow/15 animate-float-delayed" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Label with Border */}
        <div className="text-center mb-4">
          <div className="inline-block">
            <div className="text-neon-yellow font-rajdhani font-black text-sm tracking-[0.3em] uppercase px-8 py-4 border-4 border-neon-yellow/50 bg-neon-yellow/10 transform -skew-x-12">
              <span className="inline-block transform skew-x-12 flex items-center gap-2">
                <Zap className="w-4 h-4 fill-current" />
                PREMIUM CURRENCY
                <Zap className="w-4 h-4 fill-current" />
              </span>
            </div>
          </div>
        </div>

        {/* Section Title - Massive and Glowing */}
        <h2
          className="text-5xl md:text-7xl lg:text-8xl font-bebas text-center mb-6 tracking-wider uppercase text-neon-yellow animate-neon-pulse"
          style={{
            textShadow: '0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFD700, 6px 6px 0px #000',
            WebkitTextStroke: '2px #FFD700',
          }}
          data-testid="text-section-title"
        >
          CHOOSE YOUR POWER
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-300 font-rajdhani text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-semibold">
          Unlock the full potential of Los Santos with our instant AECOIN packages
        </p>

        {/* Limited Time Banner - More Exciting */}
        <div
          className="text-center mb-16 relative"
          data-testid="banner-limited-offer"
        >
          <div className="inline-block bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-4 px-12 transform -skew-x-6 border-4 border-red-800 shadow-2xl animate-gradient neon-border">
            <div className="transform skew-x-6 flex items-center gap-3">
              <Flame className="w-6 h-6 animate-pulse fill-current" />
              <span className="font-bebas text-2xl uppercase tracking-widest">
                LIMITED TIME - BONUS AECOIN ON ALL PACKAGES
              </span>
              <Flame className="w-6 h-6 animate-pulse fill-current" />
            </div>
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} onAddToCart={onAddToCart} />
          ))}
        </div>

        {/* Contact Sales - Neon Style */}
        <div className="text-center bg-gradient-to-r from-neon-yellow/10 via-neon-yellow/5 to-neon-yellow/10 border-4 border-neon-yellow/30 rounded-3xl py-10 px-8 neon-border">
          <p className="text-gray-300 font-rajdhani text-xl mb-6 font-bold">
            Need a custom package? Contact our team for bulk discounts
          </p>
          <button className="bg-black border-4 border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-black font-bebas uppercase text-2xl px-12 h-16 rounded-xl transition-all duration-300 transform hover:scale-110 tracking-widest">
            CONTACT SALES
          </button>
        </div>
      </div>
    </section>
  );
}
