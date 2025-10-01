import { ShoppingCart, LogOut, User, Package, Shield } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const { user, login, logout, isLoading } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  
  const scrollToSection = (id: string) => {
    // If we're not on the home page, navigate there first
    if (location !== "/") {
      navigate("/");
      // Wait for navigation and render, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const goToHome = () => {
    if (location !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0a1628]/95 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            className="text-xl font-rajdhani font-bold cursor-pointer text-white uppercase tracking-wider"
            onClick={goToHome}
            data-testid="logo-aecoin-store"
          >
            AECOIN<span className="text-neon-yellow">.STORE</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={goToHome}
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
              onClick={() => navigate("/rankings")}
              className="text-gray-300 hover:text-white transition-colors font-rajdhani font-semibold uppercase text-sm"
              data-testid="link-rankings"
            >
              RANKINGS
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-gray-300 hover:text-white transition-colors font-rajdhani font-semibold uppercase text-sm"
              data-testid="link-gallery"
            >
              GALLERY
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

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 h-auto p-2 rounded-full hover:bg-white/5"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="w-9 h-9 ring-2 ring-neon-yellow/50">
                      <AvatarImage src={user.avatar || undefined} alt={user.username} />
                      <AvatarFallback className="bg-neon-yellow text-black font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-white font-rajdhani font-semibold text-sm">
                      {user.username}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-[#0d1d35] border-white/10"
                >
                  <DropdownMenuLabel className="font-rajdhani text-white">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => navigate("/orders")}
                    className="font-rajdhani text-gray-300 hover:text-white focus:text-white cursor-pointer"
                    data-testid="menu-item-profile"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile & Orders
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuLabel className="font-rajdhani text-yellow-400">
                        Admin Panel
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/orders")}
                        className="font-rajdhani text-gray-300 hover:text-white focus:text-white cursor-pointer"
                        data-testid="menu-item-admin-orders"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Manage Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/packages")}
                        className="font-rajdhani text-gray-300 hover:text-white focus:text-white cursor-pointer"
                        data-testid="menu-item-admin-packages"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Manage Packages
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/coupons")}
                        className="font-rajdhani text-gray-300 hover:text-white focus:text-white cursor-pointer"
                        data-testid="menu-item-admin-coupons"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Manage Coupons
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={async () => {
                      await logout();
                      toast({
                        title: "Logged Out",
                        description: "You have been logged out successfully.",
                      });
                    }}
                    className="font-rajdhani text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer"
                    data-testid="menu-item-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => login()}
                disabled={isLoading}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-rajdhani font-bold uppercase text-sm h-9 px-6 rounded-full flex items-center gap-2"
                data-testid="button-login-discord"
              >
                <SiDiscord className="w-5 h-5" />
                Login with Discord
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
