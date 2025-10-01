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
      className="group relative overflow-hidden bg-card border-2 border-border hover-elevate transition-all duration-300"
      style={{
        boxShadow: "0 0 0 rgba(255, 215, 0, 0)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 30px rgba(255, 215, 0, 0.4)";
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
          className="absolute top-3 right-3 bg-neon-yellow text-black font-bold text-xs px-3 py-1 rounded-md z-10 uppercase whitespace-nowrap"
          data-testid={`badge-package-${pkg.id}`}
        >
          {pkg.badge}
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="aspect-square rounded-md overflow-hidden mb-4 bg-background/50">
          <img
            src={pkg.image}
            alt={`${pkg.amount} AECOIN`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            data-testid={`img-package-${pkg.id}`}
          />
        </div>
        <CardTitle className="text-xl md:text-2xl font-montserrat font-black text-center uppercase" data-testid={`text-package-amount-${pkg.id}`}>
          <span className="text-neon-yellow">
            {pkg.amount.toLocaleString()}
          </span>{" "}
          AECOIN
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-bold text-neon-yellow" data-testid={`text-price-${pkg.id}`}>
              RM{pkg.price}
            </span>
            <span className="text-lg text-muted-foreground line-through" data-testid={`text-original-price-${pkg.id}`}>
              RM{pkg.originalPrice}
            </span>
          </div>
          <Badge variant="secondary" className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
            Save {discount}%
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-neon-yellow hover:bg-neon-yellow text-black font-bold transition-all uppercase text-sm md:text-base"
          onClick={() => onAddToCart?.(pkg)}
          data-testid={`button-add-to-cart-${pkg.id}`}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
