import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      className="group relative overflow-hidden bg-card border border-border hover-elevate transition-all duration-300 rounded-sm"
      style={{
        boxShadow: "0 0 0 rgba(255, 215, 0, 0)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.3)";
        e.currentTarget.style.borderColor = "#FFD700";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 0 rgba(255, 215, 0, 0)";
        e.currentTarget.style.borderColor = "hsl(var(--border))";
      }}
      data-testid={`card-package-${pkg.id}`}
    >
      {pkg.badge && (
        <div
          className="absolute top-2 right-2 bg-neon-yellow text-black font-bold text-[10px] px-2 py-1 rounded-sm z-10 uppercase whitespace-nowrap"
          data-testid={`badge-package-${pkg.id}`}
        >
          {pkg.badge}
        </div>
      )}
      <CardHeader className="pb-3 pt-3 px-3">
        <div className="aspect-square rounded-sm overflow-hidden mb-3 bg-background/50">
          <img
            src={pkg.image}
            alt={`${pkg.amount} AECOIN`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-package-${pkg.id}`}
          />
        </div>
        <CardTitle className="text-lg font-montserrat font-black text-center uppercase" data-testid={`text-package-amount-${pkg.id}`}>
          <span className="text-neon-yellow">
            {pkg.amount.toLocaleString()}
          </span>{" "}
          AECOIN
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 px-3">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-neon-yellow" data-testid={`text-price-${pkg.id}`}>
              RM{pkg.price}
            </span>
            <span className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${pkg.id}`}>
              RM{pkg.originalPrice}
            </span>
          </div>
          <div className="text-xs text-neon-cyan font-semibold">
            SAVE {discount}%
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-3 pb-3">
        <Button
          className="w-full bg-neon-yellow hover:bg-neon-yellow text-black font-bold transition-all uppercase text-xs h-9 rounded-sm"
          onClick={() => onAddToCart?.(pkg)}
          data-testid={`button-add-to-cart-${pkg.id}`}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
