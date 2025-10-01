import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            className="text-2xl font-montserrat font-black tracking-tight cursor-pointer text-neon-yellow uppercase"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="logo-aecoin-store"
          >
            AECOIN STORE
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-foreground hover:text-neon-yellow transition-colors font-semibold uppercase text-sm"
              data-testid="link-home"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("packages")}
              className="text-foreground hover:text-neon-yellow transition-colors font-semibold uppercase text-sm"
              data-testid="link-packages"
            >
              Packages
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-foreground hover:text-neon-yellow transition-colors font-semibold uppercase text-sm"
              data-testid="link-gallery"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-foreground hover:text-neon-yellow transition-colors font-semibold uppercase text-sm"
              data-testid="link-faq"
            >
              FAQ
            </button>
          </nav>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative hover-elevate"
              data-testid="button-cart"
            >
              <ShoppingCart className="w-6 h-6 text-neon-yellow" />
              {cartItemCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1 bg-neon-yellow text-black font-bold text-xs"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
