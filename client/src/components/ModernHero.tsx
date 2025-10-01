import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import char1 from "@assets/stock_images/gta_5_character_full_c62f0654.jpg";
import char2 from "@assets/stock_images/gta_5_character_full_21562e41.jpg";

interface ModernHeroProps {
  onShopClick?: () => void;
  onGalleryClick?: () => void;
}

export function ModernHero({ onShopClick, onGalleryClick }: ModernHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [char1Position, setChar1Position] = useState({ x: 0, y: 0 });
  const [char2Position, setChar2Position] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const offsetX = (x - centerX) / centerX;
    const offsetY = (y - centerY) / centerY;
    
    setMousePosition({ x, y });
    setChar1Position({ x: -offsetX * 30, y: -offsetY * 20 });
    setChar2Position({ x: offsetX * 30, y: offsetY * 20 });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%), linear-gradient(to bottom right, #000000, #0a0a0a, #000000)',
      }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 215, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.15) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-yellow rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Left Character - Floating */}
      <div className="absolute left-0 top-0 w-1/3 h-full hidden lg:block pointer-events-none">
        <div
          className="relative h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${char1Position.x}px, ${char1Position.y}px)`,
          }}
        >
          <div className="absolute bottom-0 left-1/4 w-80 h-[550px] animate-float">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${char1})`,
                filter: 'drop-shadow(0 0 50px rgba(255, 215, 0, 0.4)) brightness(1.1)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Character - Floating */}
      <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block pointer-events-none">
        <div
          className="relative h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${char2Position.x}px, ${char2Position.y}px)`,
          }}
        >
          <div className="absolute bottom-0 right-1/4 w-80 h-[550px] animate-float-delayed">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${char2})`,
                filter: 'drop-shadow(0 0 50px rgba(255, 215, 0, 0.4)) brightness(1.1)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Center Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center px-4 max-w-5xl">
          {/* Glassmorphism badge */}
          <div className="inline-block mb-8 animate-fade-in">
            <div className="bg-white/5 backdrop-blur-xl border border-neon-yellow/30 rounded-full px-8 py-3 hover:bg-white/10 transition-all">
              <span className="text-neon-yellow font-rajdhani font-bold text-sm md:text-base uppercase tracking-widest">
                ⚡ LIMITED TIME OFFER
              </span>
            </div>
          </div>

          {/* Main Title */}
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-bebas mb-6 tracking-wider uppercase animate-title-glow"
            style={{
              background: 'linear-gradient(to bottom, #FFD700 0%, #FFA500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 60px rgba(255, 215, 0, 0.6))',
            }}
            data-testid="hero-title"
          >
            AECOIN STORE
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-3xl text-gray-200 mb-12 font-rajdhani font-semibold animate-slide-up">
            Your Ultimate Source for{" "}
            <span className="text-neon-yellow font-bold">GTA Online Currency</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16 animate-slide-up-delayed">
            <Button
              onClick={onShopClick}
              className="group relative overflow-hidden bg-neon-yellow hover:bg-neon-yellow hover:scale-105 text-black font-bold text-base px-12 h-14 uppercase rounded-sm font-rajdhani tracking-wider transition-transform shadow-2xl shadow-neon-yellow/50"
              data-testid="button-shop-now"
            >
              SHOP NOW
            </Button>
            <Button
              variant="outline"
              onClick={onGalleryClick}
              className="relative overflow-hidden bg-transparent hover:bg-neon-yellow/20 border-2 border-neon-yellow text-neon-yellow hover:text-neon-yellow font-bold text-base px-12 h-14 uppercase rounded-sm font-rajdhani tracking-wider backdrop-blur-sm hover:scale-105 transition-transform"
              data-testid="button-view-packages"
            >
              VIEW PACKAGES
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-slow">
            {[
              { value: "24/7", label: "Support" },
              { value: "99.9%", label: "Uptime" },
              { value: "Instant", label: "Delivery" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-5xl font-bebas text-neon-yellow mb-1 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 uppercase font-rajdhani font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mouse cursor glow effect */}
      <div
        className="pointer-events-none absolute w-96 h-96 rounded-full transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.12) 0%, transparent 70%)',
        }}
      />
    </section>
  );
}
