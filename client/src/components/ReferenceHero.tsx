import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Zap, Shield, Headphones } from "lucide-react";
import char1 from "@assets/stock_images/gta_5_character_port_70350ab2.jpg";

interface ReferenceHeroProps {
  onShopClick?: () => void;
  onPackagesClick?: () => void;
}

export function ReferenceHero({ onShopClick, onPackagesClick }: ReferenceHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      subtitle: "PREMIUM AECOIN CURRENCY",
      title: "DOMINATE SANTOS",
      description: "Build your criminal empire with instant AECOIN delivery. From luxury penthouses to military-grade vehicles.",
      cta1: "START EARNING",
      cta2: "VIEW PACKAGES",
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1d35] to-[#0a1628] overflow-hidden">
      {/* Left Navigation Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/10 transition-all"
        data-testid="button-prev-slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/10 transition-all"
        data-testid="button-next-slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Subtitle */}
            <div className="text-neon-yellow font-rajdhani font-semibold text-sm tracking-widest uppercase">
              {currentSlideData.subtitle}
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas text-white leading-none tracking-wide">
              {currentSlideData.title}
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-lg md:text-xl font-rajdhani max-w-xl">
              {currentSlideData.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={onShopClick}
                className="bg-neon-yellow hover:bg-neon-yellow/90 text-black font-bold text-sm px-8 h-12 uppercase rounded-sm font-rajdhani tracking-wide"
                data-testid="button-start-earning"
              >
                {currentSlideData.cta1}
              </Button>
              <Button
                onClick={onPackagesClick}
                variant="outline"
                className="border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 font-bold text-sm px-8 h-12 uppercase rounded-sm font-rajdhani tracking-wide"
                data-testid="button-view-packages"
              >
                {currentSlideData.cta2}
              </Button>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-sm bg-neon-yellow/10 border border-neon-yellow/30 flex items-center justify-center flex-shrink-0">
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
            <div className="relative">
              <img
                src={char1}
                alt="GTA Character"
                className="w-full max-w-md mx-auto lg:max-w-lg relative z-10"
                style={{
                  filter: 'drop-shadow(0 0 60px rgba(255, 215, 0, 0.3))',
                }}
                data-testid="img-hero-character"
              />
              {/* GTA Badge */}
              <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-neon-yellow flex items-center justify-center">
                <span className="text-black font-bebas text-2xl tracking-wider">GTA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? "bg-neon-yellow w-8" : "bg-white/30"
            }`}
            data-testid={`indicator-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
