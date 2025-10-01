import { Facebook, Twitter, Instagram, Youtube, DollarSign, Star } from "lucide-react";
import footerBg from "@assets/stock_images/gta_5_los_santos_cit_316848d5.jpg";

export function Footer() {
  return (
    <footer className="relative bg-black border-t-4 border-neon-yellow/50 overflow-hidden">
      {/* Background Image with Heavy Effects */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${footerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/80" />
      
      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)',
        backgroundSize: '100px 100px',
      }} />

      {/* Floating Icons */}
      <DollarSign className="absolute top-10 left-10 w-16 h-16 text-neon-yellow/10 animate-float" />
      <Star className="absolute top-20 right-20 w-12 h-12 text-neon-yellow/10 animate-float-delayed fill-current" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Top Section - Logo */}
        <div className="text-center mb-16">
          <h2 
            className="text-6xl md:text-7xl font-bebas text-neon-yellow mb-4 uppercase tracking-widest animate-neon-pulse"
            style={{
              textShadow: '0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFD700',
              WebkitTextStroke: '2px #000',
            }}
          >
            AECOIN<span className="text-white">.STORE</span>
          </h2>
          <p className="text-gray-300 font-rajdhani text-xl font-semibold max-w-2xl mx-auto">
            Your trusted source for GTA Online currency. Fast, secure, and reliable.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Social Media */}
          <div className="text-center md:text-left">
            <h3 className="text-neon-yellow font-bebas text-2xl uppercase tracking-wider mb-6 text-glow">Connect</h3>
            <div className="flex gap-4 justify-center md:justify-start">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" }
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-yellow/20 to-neon-yellow/5 hover:from-neon-yellow hover:to-yellow-500 border-4 border-neon-yellow/30 hover:border-neon-yellow flex items-center justify-center text-neon-yellow hover:text-black transition-all duration-300 transform hover:scale-110 hover:-rotate-6 neon-border"
                  data-testid={`link-${label.toLowerCase()}`}
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-neon-yellow font-bebas text-2xl uppercase tracking-wider mb-6 text-glow">Quick Links</h3>
            <ul className="space-y-3 font-rajdhani font-semibold">
              {['Home', 'Packages', 'Gallery', 'FAQ'].map(link => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase()}`} 
                    className="text-gray-300 hover:text-neon-yellow transition-all text-lg hover:translate-x-2 inline-block"
                  >
                    › {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="text-center md:text-left">
            <h3 className="text-neon-yellow font-bebas text-2xl uppercase tracking-wider mb-6 text-glow">Information</h3>
            <ul className="space-y-3 font-rajdhani font-semibold">
              {['About Us', 'Terms of Service', 'Privacy Policy', 'Refund Policy'].map(link => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-neon-yellow transition-all text-lg hover:translate-x-2 inline-block"
                  >
                    › {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods - Gaming Style */}
          <div className="text-center md:text-left">
            <h3 className="text-neon-yellow font-bebas text-2xl uppercase tracking-wider mb-6 text-glow">Secure Payments</h3>
            <p className="text-gray-400 font-rajdhani text-base mb-6 font-semibold">
              We accept all major payment methods
            </p>
            <div className="flex gap-3 flex-wrap justify-center md:justify-start">
              {['STRIPE', 'VISA', 'MASTERCARD'].map(method => (
                <div 
                  key={method}
                  className="px-4 py-2 bg-gradient-to-br from-neon-yellow/20 to-transparent border-2 border-neon-yellow/50 rounded-xl text-neon-yellow font-bebas text-sm font-bold transform hover:scale-110 transition-all"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-4 border-neon-yellow/30 pt-10 mt-10">
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-neon-yellow/10 via-neon-yellow/5 to-neon-yellow/10 border-4 border-neon-yellow/30 rounded-2xl px-8 py-4 neon-border">
              <p className="text-gray-400 font-rajdhani text-lg font-bold">
                © {new Date().getFullYear()} AECOIN.STORE. All rights reserved. Made for <span className="text-neon-yellow">GTA 5 Players</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
