import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0a1628]/95 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            className="text-xl font-rajdhani font-bold cursor-pointer text-white uppercase tracking-wider"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="logo-aecoin-store"
          >
            AECOIN<span className="text-neon-yellow">.STORE</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-gray-300 hover:text-white transition-colors font-rajdhani font-semibold uppercase text-sm"
              data-testid="link-home"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection("packages")}
              className="text-gray-300 hover:text-white transition-colors font-rajdhani font-semibold uppercase text-sm"
              data-testid="link-packages"
            >
              PACKAGES
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-gray-300 hover:text-white transition-colors font-rajdhani font-semibold uppercase text-sm"
              data-testid="link-gallery"
            >
              GALLERY
            </button>
            <button
              onClick={() => scrollToSection("orders")}
              className="text-gray-300 hover:text-white transition-colors font-rajdhani font-semibold uppercase text-sm"
              data-testid="link-orders"
            >
              ORDERS
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-gray-300 hover:text-white transition-colors font-rajdhani font-semibold uppercase text-sm"
              data-testid="link-faq"
            >
              FAQ
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative text-white hover:text-neon-yellow rounded-full"
              data-testid="button-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1 bg-neon-yellow text-black font-bold text-xs rounded-full"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white font-rajdhani font-semibold uppercase text-sm h-9 px-4 rounded-full"
              data-testid="button-login"
            >
              Login
            </Button>
            <Button
              className="bg-neon-yellow hover:bg-neon-yellow/90 text-black font-rajdhani font-bold uppercase text-sm h-9 px-6 rounded-full"
              data-testid="button-signup"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
