import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import footerBg from "@assets/stock_images/gta_5_los_santos_cit_316848d5.jpg";

export function Footer() {
  return (
    <footer className="relative bg-[#060d1a] border-t border-white/10 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${footerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060d1a] via-[#060d1a]/90 to-[#060d1a]/70" />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-xl font-rajdhani font-bold text-white uppercase tracking-wider mb-4">
              AECOIN<span className="text-neon-yellow">.STORE</span>
            </div>
            <p className="text-gray-400 font-rajdhani text-sm mb-6">
              Your trusted source for GTA Online currency. Fast, secure, and reliable.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-neon-yellow/20 border border-white/10 hover:border-neon-yellow/30 flex items-center justify-center text-gray-400 hover:text-neon-yellow transition-all"
                data-testid="link-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-neon-yellow/20 border border-white/10 hover:border-neon-yellow/30 flex items-center justify-center text-gray-400 hover:text-neon-yellow transition-all"
                data-testid="link-twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-neon-yellow/20 border border-white/10 hover:border-neon-yellow/30 flex items-center justify-center text-gray-400 hover:text-neon-yellow transition-all"
                data-testid="link-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-neon-yellow/20 border border-white/10 hover:border-neon-yellow/30 flex items-center justify-center text-gray-400 hover:text-neon-yellow transition-all"
                data-testid="link-youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bebas text-xl uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 font-rajdhani">
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-yellow transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#packages" className="text-gray-400 hover:text-neon-yellow transition-colors">
                  Packages
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-400 hover:text-neon-yellow transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-neon-yellow transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bebas text-xl uppercase tracking-wider mb-4">Information</h3>
            <ul className="space-y-2 font-rajdhani">
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-yellow transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-yellow transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-yellow transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-yellow transition-colors">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bebas text-xl uppercase tracking-wider mb-4">Secure Payments</h3>
            <p className="text-gray-400 font-rajdhani text-sm mb-4">
              We accept all major payment methods
            </p>
            <div className="flex gap-2 flex-wrap">
              <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400 font-rajdhani text-xs font-semibold">
                STRIPE
              </div>
              <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400 font-rajdhani text-xs font-semibold">
                VISA
              </div>
              <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400 font-rajdhani text-xs font-semibold">
                MASTERCARD
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="text-center text-gray-500 font-rajdhani text-sm">
            © {new Date().getFullYear()} AECOIN.STORE. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
