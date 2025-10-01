import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Headphones, DollarSign, Star } from "lucide-react";
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
      leftChar: char1,
      rightChar: char2,
      topBadge: "JOIN AECOIN.STORE PREMIUM MEMBERS",
      mainTitle: "GET READY TO GET THE BEST AECOIN?",
      productName: "CRIMINAL STARTER",
      productIcon: DollarSign,
      cta: "JOIN NOW",
      theme: "yellow",
    },
    {
      leftChar: char3,
      rightChar: char4,
      topBadge: "EXCLUSIVE VIP PACKAGES AVAILABLE",
      mainTitle: "READY TO DOMINATE LOS SANTOS?",
      productName: "KINGPIN PACKAGE",
      productIcon: Star,
      cta: "GRAB YOUR PACKAGE",
      theme: "yellow",
    },
    {
      leftChar: char2,
      rightChar: char1,
      topBadge: "INSTANT DELIVERY • 100% SECURE",
      mainTitle: "BUILD YOUR CRIMINAL EMPIRE TODAY?",
      productName: "EMPIRE BUILDER",
      productIcon: Shield,
      cta: "START BUILDING",
      theme: "yellow",
    },
    {
      leftChar: char4,
      rightChar: char3,
      topBadge: "24/7 SUPPORT • TRUSTED BY THOUSANDS",
      mainTitle: "LIVE THE LUXURY LIFESTYLE?",
      productName: "LUXURY ELITE",
      productIcon: Zap,
      cta: "UNLOCK NOW",
      theme: "yellow",
    },
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
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center mt-16">
      {/* Dark Atmospheric Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
      
      {/* Smoky/Foggy Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-transparent to-black" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Radial Glow in Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-yellow/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Left Character */}
          <div className="col-span-3 relative h-[600px] flex items-end justify-center">
            <div 
              className="relative"
              key={`left-${currentSlide}`}
              style={{ animation: "slideInLeft 0.8s ease-out" }}
            >
              <img
                src={currentSlideData.leftChar}
                alt="GTA Character Left"
                className="h-[580px] w-auto object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(0, 0, 0, 0.8))',
                }}
                data-testid="img-hero-left"
              />
            </div>
          </div>

          {/* Center Content */}
          <div className="col-span-6 text-center space-y-8 py-12">
            {/* Top Badge */}
            <div 
              className="inline-block"
              key={`badge-${currentSlide}`}
              style={{ animation: "fadeIn 0.6s ease-out" }}
            >
              <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 px-6 py-3 rounded-lg">
                <span className="text-gray-300 font-rajdhani font-bold text-sm tracking-widest uppercase">
                  {currentSlideData.topBadge}
                </span>
              </div>
            </div>

            {/* Main Title */}
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bebas text-white leading-tight uppercase px-4"
              key={`title-${currentSlide}`}
              style={{ 
                animation: "slideInUp 0.8s ease-out",
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
              }}
              data-testid="text-hero-title"
            >
              {currentSlideData.mainTitle}
            </h1>

            {/* Product Showcase - Icon in Center */}
            <div 
              className="relative py-12"
              key={`product-${currentSlide}`}
              style={{ animation: "scaleIn 0.8s ease-out" }}
            >
              {/* Glow Behind Icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-yellow/20 rounded-full blur-3xl" />
              
              {/* Large Icon */}
              <div className="relative z-10 flex justify-center">
                <div className="w-40 h-40 bg-gradient-to-br from-neon-yellow/30 to-yellow-600/30 rounded-3xl border-4 border-neon-yellow/50 flex items-center justify-center neon-border-strong backdrop-blur-sm">
                  <currentSlideData.productIcon className="w-24 h-24 text-neon-yellow animate-pulse" />
                </div>
              </div>
              
              {/* Product Name */}
              <div className="mt-8">
                <h3 
                  className="text-3xl md:text-4xl font-bebas text-neon-yellow uppercase tracking-[0.2em] text-glow-strong"
                  style={{
                    textShadow: '0 0 20px #FFD700, 0 0 40px #FFD700',
                  }}
                >
                  {currentSlideData.productName}
                </h3>
              </div>
            </div>

            {/* CTA Button */}
            <div
              key={`cta-${currentSlide}`}
              style={{ animation: "slideInUp 1s ease-out" }}
            >
              <Button
                onClick={onShopClick}
                className="bg-gradient-to-r from-neon-yellow via-yellow-400 to-neon-yellow hover:from-yellow-400 hover:to-neon-yellow text-black font-black text-xl px-16 h-16 uppercase rounded-xl font-bebas tracking-widest shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-yellow-600 animate-gradient"
                data-testid="button-hero-cta"
              >
                {currentSlideData.cta}
              </Button>
            </div>
          </div>

          {/* Right Character */}
          <div className="col-span-3 relative h-[600px] flex items-end justify-center">
            <div 
              className="relative"
              key={`right-${currentSlide}`}
              style={{ animation: "slideInRight 0.8s ease-out" }}
            >
              <img
                src={currentSlideData.rightChar}
                alt="GTA Character Right"
                className="h-[580px] w-auto object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(0, 0, 0, 0.8))',
                }}
                data-testid="img-hero-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators - Centered at Bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index 
                ? "bg-neon-yellow w-12 h-3 shadow-lg shadow-neon-yellow/50" 
                : "bg-gray-500 w-3 h-3 hover:bg-gray-400"
            }`}
            data-testid={`indicator-${index}`}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
