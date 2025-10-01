import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Headphones, DollarSign, Star, Crown } from "lucide-react";
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
      title: ["DOMINATE", "SANTOS"],
      description: "Build your criminal empire with instant AECOIN delivery. From luxury penthouses to military-grade vehicles.",
      cta1: "START EARNING",
      cta2: "VIEW PACKAGES",
      theme: "red",
    },
    {
      image: char2,
      badge: "HEIST",
      subtitle: "UNLIMITED POSSIBILITIES",
      title: ["EXECUTE THE", "PERFECT HEIST"],
      description: "Get the gear you need for the biggest scores. Premium weapons, getaway vehicles, and high-tech equipment.",
      cta1: "GEAR UP NOW",
      cta2: "EXPLORE ARSENAL",
      theme: "green",
    },
    {
      image: char3,
      badge: "CREW",
      subtitle: "STRENGTH IN NUMBERS",
      title: ["BUILD YOUR", "EMPIRE"],
      description: "Team up or go solo. With our AECOIN packages, you'll have the resources to rule Los Santos your way.",
      cta1: "JOIN THE ELITE",
      cta2: "VIEW DEALS",
      theme: "blue",
    },
    {
      image: char4,
      badge: "BOSS",
      subtitle: "LUXURY LIFESTYLE",
      title: ["LIVE LIKE", "ROYALTY"],
      description: "From street corners to penthouse suites. Transform your GTA experience with unlimited purchasing power.",
      cta1: "CLAIM YOUR THRONE",
      cta2: "SEE PACKAGES",
      theme: "purple",
    },
  ];

  const features = [
    { icon: Zap, title: "INSTANT", sub: "DELIVERY" },
    { icon: Shield, title: "100%", sub: "SECURE" },
    { icon: Headphones, title: "24/7", sub: "SUPPORT" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
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

  return (
    <section className="relative h-screen bg-black overflow-hidden flex items-center pt-16">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'gradient-shift 20s linear infinite',
      }} />

      {/* Radial Glow */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-yellow/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Floating Money Icons */}
      <DollarSign className="absolute top-20 left-10 w-12 h-12 text-neon-yellow/20 animate-float" />
      <DollarSign className="absolute top-40 right-20 w-16 h-16 text-neon-yellow/10 animate-float-delayed" />
      <Star className="absolute bottom-40 left-20 w-10 h-10 text-neon-yellow/20 animate-float fill-current" />
      <Crown className="absolute top-32 right-40 w-14 h-14 text-neon-yellow/15 animate-float-delayed" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div 
            className="space-y-8"
            key={`content-${currentSlide}`}
          >
            {/* Subtitle with Border */}
            <div className="inline-block">
              <div className="text-neon-yellow font-rajdhani font-black text-sm tracking-[0.3em] uppercase px-6 py-3 border-4 border-neon-yellow/50 bg-neon-yellow/10 transform -skew-x-12 inline-block">
                <span className="inline-block transform skew-x-12">{currentSlideData.subtitle}</span>
              </div>
            </div>

            {/* Main Title with Glitch Effect */}
            <div className="space-y-2">
              {currentSlideData.title.map((line, i) => (
                <h1 
                  key={i}
                  className="text-6xl md:text-8xl lg:text-9xl font-bebas text-white leading-none tracking-wide uppercase text-glow-strong animate-neon-pulse"
                  style={{
                    textShadow: '0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFD700, 4px 4px 0px #000',
                    WebkitTextStroke: '2px #FFD700',
                  }}
                >
                  {line}
                </h1>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-xl md:text-2xl font-rajdhani max-w-xl leading-relaxed font-semibold">
              {currentSlideData.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-6">
              <Button
                onClick={onShopClick}
                className="bg-gradient-to-r from-neon-yellow via-yellow-400 to-neon-yellow hover:from-yellow-400 hover:to-neon-yellow text-black font-black text-lg px-12 h-16 uppercase rounded-xl font-rajdhani tracking-widest shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-yellow-600 animate-gradient neon-border-strong"
                data-testid="button-start-earning"
              >
                <Zap className="w-6 h-6 mr-2 fill-current" />
                {currentSlideData.cta1}
              </Button>
              <Button
                onClick={onPackagesClick}
                className="border-4 border-neon-yellow bg-black/50 backdrop-blur-sm text-neon-yellow hover:bg-neon-yellow hover:text-black font-black text-lg px-12 h-16 uppercase rounded-xl font-rajdhani tracking-widest transform hover:scale-110 transition-all duration-300"
                data-testid="button-view-packages"
              >
                {currentSlideData.cta2}
              </Button>
            </div>

            {/* Feature Badges - More Dynamic */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-neon-yellow/20 to-neon-yellow/5 border-4 border-neon-yellow/50 rounded-2xl p-4 text-center transform hover:scale-110 hover:-rotate-3 transition-all duration-300 neon-border">
                    <feature.icon className="w-10 h-10 text-neon-yellow mx-auto mb-2 animate-pulse" />
                    <div className="text-neon-yellow font-bebas text-2xl uppercase tracking-wider text-glow">
                      {feature.title}
                    </div>
                    <div className="text-white font-rajdhani text-sm font-bold uppercase">
                      {feature.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Character with Effects */}
          <div className="relative">
            <div 
              className="relative"
              key={`character-${currentSlide}`}
            >
              {/* Character Image */}
              <div className="relative">
                <img
                  src={currentSlideData.image}
                  alt={`GTA Character ${currentSlide + 1}`}
                  className="w-full max-w-md mx-auto lg:max-w-lg xl:max-w-xl relative z-10 drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  style={{
                    filter: 'drop-shadow(0 0 80px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.4))',
                  }}
                  data-testid="img-hero-character"
                />
                
                {/* Animated Badge */}
                <div 
                  className="absolute -top-4 -right-4 w-28 h-28 bg-gradient-to-br from-neon-yellow to-yellow-600 flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500 border-4 border-yellow-800 neon-border-strong"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                  }}
                >
                  <span className="text-black font-bebas text-3xl tracking-wider transform -rotate-12">
                    {currentSlideData.badge}
                  </span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-neon-yellow/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-neon-yellow/20 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators - More Prominent */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 ${
              currentSlide === index 
                ? "bg-neon-yellow w-16 h-4 rounded-full shadow-lg shadow-neon-yellow/50" 
                : "bg-white/30 w-4 h-4 rounded-full hover:bg-white/60"
            }`}
            data-testid={`indicator-${index}`}
          />
        ))}
      </div>

      {/* Slide Counter - Neon Style */}
      <div className="absolute bottom-12 right-8 z-20 font-bebas text-4xl">
        <span className="text-neon-yellow text-glow-strong">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="text-white/30 mx-2">/</span>
        <span className="text-white/50">{String(slides.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
