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
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-xl border-b-4 border-neon-yellow/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Gaming Style */}
          <div
            className="text-2xl font-bebas cursor-pointer text-neon-yellow uppercase tracking-widest text-glow-strong hover:scale-110 transition-transform"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="logo-aecoin-store"
            style={{
              textShadow: '0 0 20px #FFD700, 0 0 40px #FFD700',
              WebkitTextStroke: '1px #000',
            }}
          >
            AECOIN<span className="text-white">.STORE</span>
          </div>

          {/* Navigation - Glowing Style */}
          <nav className="hidden md:flex items-center gap-8">
            {['HOME', 'PACKAGES', 'GALLERY', 'ORDERS', 'FAQ'].map((item, i) => (
              <button
                key={item}
                onClick={() => item === 'HOME' ? window.scrollTo({ top: 0, behavior: "smooth" }) : scrollToSection(item.toLowerCase())}
                className="text-gray-300 hover:text-neon-yellow transition-all font-bebas uppercase text-lg tracking-wider relative group"
                data-testid={`link-${item.toLowerCase()}`}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-neon-yellow group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative text-neon-yellow hover:text-white rounded-full hover:bg-neon-yellow/20 border-2 border-transparent hover:border-neon-yellow transition-all"
              data-testid="button-cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-6 min-w-6 flex items-center justify-center p-0 px-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-black text-xs rounded-full border-2 border-white animate-pulse"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white font-bebas uppercase text-lg h-10 px-6 rounded-xl border-2 border-gray-600 hover:border-neon-yellow transition-all"
              data-testid="button-login"
            >
              Login
            </Button>
            <Button
              className="bg-gradient-to-r from-neon-yellow via-yellow-400 to-neon-yellow hover:from-yellow-400 hover:to-neon-yellow text-black font-bebas uppercase text-lg h-10 px-8 rounded-xl border-4 border-yellow-600 shadow-xl animate-gradient font-black"
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
