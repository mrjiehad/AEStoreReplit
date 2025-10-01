import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Card
      className="group relative overflow-hidden bg-gradient-to-br from-[#1a2942] to-[#0d1d35] border-2 border-white/10 hover:border-neon-yellow/50 transition-all duration-300 rounded-3xl"
      data-testid={`card-package-${pkg.id}`}
    >
      {/* Image Background */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
        <img
          src={pkg.image}
          alt={`${pkg.amount} AECOIN`}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          data-testid={`img-package-${pkg.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1d35] via-transparent to-transparent" />
        
        {/* Badge */}
        {pkg.badge && (
          <div
            className="absolute top-4 right-4 bg-neon-yellow text-black font-bold text-xs px-3 py-1 rounded-full uppercase"
            data-testid={`badge-package-${pkg.id}`}
          >
            {pkg.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <CardHeader className="pb-2 pt-6">
        <div className="text-center">
          <div className="text-5xl font-bebas text-white tracking-wider" data-testid={`text-package-amount-${pkg.id}`}>
            {pkg.amount.toLocaleString()}
          </div>
          <div className="text-sm font-rajdhani text-gray-400 uppercase tracking-widest mt-1">
            AECOIN
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-3xl font-bold text-neon-yellow" data-testid={`text-price-${pkg.id}`}>
              RM{pkg.price}
            </span>
            <span className="text-base text-gray-500 line-through" data-testid={`text-original-price-${pkg.id}`}>
              RM{pkg.originalPrice}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6">
        <Button
          className="w-full bg-neon-yellow hover:bg-neon-yellow/90 text-black font-bold uppercase text-sm h-12 rounded-full font-rajdhani tracking-wide shadow-lg shadow-neon-yellow/20"
          onClick={() => onAddToCart?.(pkg)}
          data-testid={`button-add-to-cart-${pkg.id}`}
        >
          BUY NOW
        </Button>
      </CardFooter>
    </Card>
  );
}
