import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Star, Zap } from "lucide-react";

export interface Package {
  id: string;
  amount: number;
  price: number;
  originalPrice: number;
  image: string;
  badge?: string;
}

interface PackageCardProps {
  package: Package;
  onAddToCart?: (pkg: Package) => void;
}

export function PackageCard({ package: pkg, onAddToCart }: PackageCardProps) {
  const discount = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);

  return (
    <div className="group perspective-1000">
      <Card
        className="relative overflow-hidden bg-gradient-to-br from-[#1a2942] via-[#0d1d35] to-black border-4 border-neon-yellow/30 hover:border-neon-yellow transition-all duration-500 transform hover:scale-105 hover:-rotate-2 neon-border"
        style={{
          backgroundImage: `linear-gradient(135deg, #1a2942 0%, #0d1d35 50%, #000 100%)`,
          transform: "translateZ(0)",
        }}
        data-testid={`card-package-${pkg.id}`}
      >
        {/* Animated Corner Stars */}
        <div className="absolute top-2 left-2 text-neon-yellow animate-pulse">
          <Star className="w-4 h-4 fill-current" />
        </div>
        <div className="absolute top-2 right-2 text-neon-yellow animate-pulse delay-75">
          <Star className="w-4 h-4 fill-current" />
        </div>
        <div className="absolute bottom-2 left-2 text-neon-yellow animate-pulse delay-150">
          <Star className="w-4 h-4 fill-current" />
        </div>
        <div className="absolute bottom-2 right-2 text-neon-yellow animate-pulse delay-200">
          <Star className="w-4 h-4 fill-current" />
        </div>

        {/* Diagonal Stripe */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-neon-yellow/10 rotate-45 transform group-hover:scale-150 transition-transform duration-700" />

        {/* Image Section with Tilt */}
        <div className="relative aspect-square overflow-hidden rounded-t-2xl border-b-4 border-neon-yellow/50">
          <img
            src={pkg.image}
            alt={`${pkg.amount} AECOIN`}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-6"
            data-testid={`img-package-${pkg.id}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          
          {/* Badge */}
          {pkg.badge && (
            <div
              className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-black text-xs px-4 py-2 transform -rotate-12 shadow-lg border-2 border-white uppercase animate-pulse"
              data-testid={`badge-package-${pkg.id}`}
            >
              {pkg.badge}
            </div>
          )}
          
          {/* Discount Badge */}
          <div className="absolute top-4 left-4 bg-neon-yellow text-black font-black text-sm px-3 py-1 transform rotate-12 shadow-lg uppercase">
            -{discount}%
          </div>

          {/* Floating Dollar Signs */}
          <div className="absolute inset-0 pointer-events-none">
            <DollarSign className="absolute top-1/4 left-1/4 w-8 h-8 text-neon-yellow/20 animate-float" />
            <DollarSign className="absolute top-1/2 right-1/4 w-6 h-6 text-neon-yellow/30 animate-float-delayed" />
          </div>
        </div>

        {/* Content */}
        <CardHeader className="pb-3 pt-6 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-neon-yellow fill-current animate-pulse" />
              <div className="text-6xl font-bebas text-neon-yellow tracking-wider text-glow-strong animate-neon-pulse" data-testid={`text-package-amount-${pkg.id}`}>
                {pkg.amount.toLocaleString()}
              </div>
              <Zap className="w-6 h-6 text-neon-yellow fill-current animate-pulse" />
            </div>
            <div className="text-sm font-rajdhani text-gray-300 uppercase tracking-[0.3em] font-bold">
              AECOIN
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4 relative z-10">
          <div className="text-center bg-black/30 rounded-2xl py-3 px-4 border-2 border-neon-yellow/20">
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-4xl font-black text-neon-yellow text-glow" data-testid={`text-price-${pkg.id}`}>
                RM{pkg.price}
              </span>
              <span className="text-lg text-gray-500 line-through font-bold" data-testid={`text-original-price-${pkg.id}`}>
                RM{pkg.originalPrice}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 pb-6 relative z-10">
          <Button
            className="w-full bg-gradient-to-r from-neon-yellow via-yellow-400 to-neon-yellow hover:from-yellow-400 hover:to-neon-yellow text-black font-black uppercase text-base h-14 rounded-xl font-rajdhani tracking-widest shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-yellow-600 animate-gradient"
            onClick={() => onAddToCart?.(pkg)}
            data-testid={`button-add-to-cart-${pkg.id}`}
          >
            <DollarSign className="w-5 h-5 mr-2" />
            BUY NOW
            <DollarSign className="w-5 h-5 ml-2" />
          </Button>
        </CardFooter>

        {/* Animated Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-neon-yellow/20 via-transparent to-transparent blur-xl" />
        </div>
      </Card>
    </div>
  );
}
