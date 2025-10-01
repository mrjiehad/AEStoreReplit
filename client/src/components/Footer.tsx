import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t-2 border-neon-yellow/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div data-testid="footer-company-info">
            <h3 className="text-xl font-montserrat font-black text-neon-yellow mb-4 uppercase">AECOIN STORE</h3>
            <p className="text-muted-foreground mb-4">
              Fast, Secure, Reliable gaming currency provider for GTA Online players worldwide.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="link-facebook">
                <Facebook className="w-5 h-5 text-neon-yellow" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="link-twitter">
                <Twitter className="w-5 h-5 text-neon-yellow" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="link-instagram">
                <Instagram className="w-5 h-5 text-neon-yellow" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="link-youtube">
                <Youtube className="w-5 h-5 text-neon-yellow" />
              </Button>
            </div>
          </div>

          <div data-testid="footer-quick-links">
            <h3 className="text-xl font-montserrat font-black text-neon-yellow mb-4 uppercase">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-neon-yellow transition-colors">
                  User Control Panel
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-neon-yellow transition-colors">
                  Changelog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-neon-yellow transition-colors">
                  Creators
                </a>
              </li>
            </ul>
          </div>

          <div data-testid="footer-info-links">
            <h3 className="text-xl font-montserrat font-black text-neon-yellow mb-4 uppercase">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-neon-yellow transition-colors">
                  Whitelist
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-neon-yellow transition-colors">
                  Admin
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-neon-yellow transition-colors">
                  Gangs
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm" data-testid="text-copyright">
              © 2024 AECOIN STORE – Fast, Secure, Reliable.
            </p>
            <div className="flex items-center gap-4">
              <Badge
                className="bg-neon-green/20 text-neon-green border-neon-green/30 font-bold"
                data-testid="badge-status"
              >
                ✓ All Systems Operational
              </Badge>
              <Button
                size="sm"
                className="bg-neon-yellow hover:bg-neon-yellow text-black font-bold uppercase"
                data-testid="button-get-in-touch"
              >
                GET IN TOUCH
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
