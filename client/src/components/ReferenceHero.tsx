import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Headphones } from "lucide-react";
import char1 from "@assets/1_1759280228659.png";
import char2 from "@assets/2_1759280228660.png";
import char3 from "@assets/3_1759280228660.png";
import char4 from "@assets/4_1759280228661.png";

interface ReferenceHeroProps {
  onShopClick?: () => void;
  onPackagesClick?: () => void;
}

export function ReferenceHero({ onShopClick, onPackagesClick }: ReferenceHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const slides = [
    {
      image: char1,
      badge: "GTA",
      subtitle: "PREMIUM AECOIN CURRENCY",
      title: "DOMINATE SANTOS",
      description: "Build your criminal empire with instant AECOIN delivery. From luxury penthouses to military-grade vehicles.",
      cta1: "START EARNING",
      cta2: "VIEW PACKAGES",
      theme: "red",
    },
    {
      image: char2,
      badge: "HEIST",
      subtitle: "UNLIMITED POSSIBILITIES",
      title: "EXECUTE THE PERFECT HEIST",
      description: "Get the gear you need for the biggest scores. Premium weapons, getaway vehicles, and high-tech equipment.",
      cta1: "GEAR UP NOW",
      cta2: "EXPLORE ARSENAL",
      theme: "green",
    },
    {
      image: char3,
      badge: "CREW",
      subtitle: "STRENGTH IN NUMBERS",
      title: "BUILD YOUR EMPIRE",
      description: "Team up or go solo. With our AECOIN packages, you'll have the resources to rule Los Santos your way.",
      cta1: "JOIN THE ELITE",
      cta2: "VIEW DEALS",
      theme: "blue",
    },
    {
      image: char4,
      badge: "BOSS",
      subtitle: "LUXURY LIFESTYLE",
      title: "LIVE LIKE ROYALTY",
      description: "From street corners to penthouse suites. Transform your GTA experience with unlimited purchasing power.",
      cta1: "CLAIM YOUR THRONE",
      cta2: "SEE PACKAGES",
      theme: "purple",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "INSTANT DELIVERY",
      description: "Codes delivered in seconds",
    },
    {
      icon: Shield,
      title: "100% SECURE",
      description: "Bank-level encryption",
    },
    {
      icon: Headphones,
      title: "24/7 SUPPORT",
      description: "Always here to help",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const goToSlide = (index: number) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const currentSlideData = slides[currentSlide];

  const getThemeGlow = (theme: string) => {
    switch(theme) {
      case "red": return "rgba(255, 59, 48, 0.4)";
      case "green": return "rgba(52, 199, 89, 0.4)";
      case "blue": return "rgba(0, 122, 255, 0.4)";
      case "purple": return "rgba(175, 82, 222, 0.4)";
      default: return "rgba(255, 215, 0, 0.4)";
    }
  };

  return (
    <section className="relative h-[calc(100vh-4rem)] mt-16 bg-gradient-to-br from-[#0a1628] via-[#0d1d35] to-[#0a1628] overflow-hidden flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle, ${getThemeGlow(currentSlideData.theme)} 0%, transparent 70%)`
          }}
        />
        <div 
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle, ${getThemeGlow(currentSlideData.theme)} 0%, transparent 70%)`
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div 
            className="space-y-8"
            key={`content-${currentSlide}`}
            style={{ animation: "slideInLeft 0.6s ease-out" }}
          >
            <div className="text-neon-yellow font-rajdhani font-semibold text-sm tracking-widest uppercase">
              {currentSlideData.subtitle}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bebas text-white leading-none tracking-wide uppercase whitespace-nowrap">
              {currentSlideData.title}
            </h1>

            <p className="text-gray-300 text-lg md:text-xl font-rajdhani max-w-xl leading-relaxed">
              {currentSlideData.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={onShopClick}
                className="bg-neon-yellow hover:bg-neon-yellow/90 text-black font-bold text-sm px-8 h-12 uppercase rounded-full font-rajdhani tracking-wide shadow-lg"
                data-testid="button-start-earning"
              >
                {currentSlideData.cta1}
              </Button>
              <Button
                onClick={onPackagesClick}
                variant="outline"
                className="border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 font-bold text-sm px-8 h-12 uppercase rounded-full font-rajdhani tracking-wide"
                data-testid="button-view-packages"
              >
                {currentSlideData.cta2}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3"
                  style={{ animation: `fadeInUp 0.6s ease-out ${0.2 + index * 0.1}s both` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-neon-yellow/10 border border-neon-yellow/30 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-neon-yellow" />
                  </div>
                  <div>
                    <div className="text-white font-rajdhani font-bold text-sm uppercase">
                      {feature.title}
                    </div>
                    <div className="text-gray-400 text-xs font-rajdhani">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Character */}
          <div className="relative">
            <div 
              className="relative"
              key={`character-${currentSlide}`}
              style={{ animation: "slideInRight 0.6s ease-out" }}
            >
              <img
                src={currentSlideData.image}
                alt={`GTA Character ${currentSlide + 1}`}
                className="w-full max-w-md mx-auto lg:max-w-lg xl:max-w-xl relative z-10 drop-shadow-2xl"
                style={{ filter: `drop-shadow(0 0 60px ${getThemeGlow(currentSlideData.theme)})` }}
                data-testid="img-hero-character"
              />
              
              <div 
                className="absolute top-8 right-8 w-20 h-20 rounded-full bg-neon-yellow flex items-center justify-center shadow-lg"
                style={{ animation: "scaleIn 0.4s ease-out 0.3s both" }}
              >
                <span className="text-black font-bebas text-2xl tracking-wider">
                  {currentSlideData.badge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index 
                ? "bg-neon-yellow w-10 h-3" 
                : "bg-white/30 w-3 h-3 hover:bg-white/50"
            }`}
            data-testid={`indicator-${index}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-20 font-bebas text-white/50 text-lg">
        <span className="text-neon-yellow text-2xl">{String(currentSlide + 1).padStart(2, '0')}</span>
        {' / '}
        {String(slides.length).padStart(2, '0')}
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5) rotate(-180deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </section>
  );
}
