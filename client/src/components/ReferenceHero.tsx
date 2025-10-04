import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

function TypingText({ text, speed = 100 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <>{displayedText}<span className="animate-pulse">|</span></>;
}
import gta1 from "@assets/gta1_1759551121573.png";
import gta2 from "@assets/gta2_1759551121574.png";
import gta3 from "@assets/gta3_1759551121575.png";
import gta4 from "@assets/gta4_1759551121575.png";
import trailerThumb from "@assets/hqdefault_1759551446234.jpg";
import heroVideo from "@assets/AE OFFICIAL_1759556099982.mp4";

interface ReferenceHeroProps {
  onShopClick?: () => void;
  onPackagesClick?: () => void;
  onRankingsClick?: () => void;
}

export function ReferenceHero({ onShopClick, onPackagesClick, onRankingsClick }: ReferenceHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const slides = [
    {
      image: gta1,
      logo: "AECOIN",
      subtitle: "MODERN CURRENCY",
      title: "DOMINATE LOS SANTOS",
      description: "AECOIN is a premium virtual currency system designed specifically for GTA Online. Starting with instant delivery in 2025, it revolutionized in-game purchases. The most efficient way to acquire luxury vehicles, high-end properties, and exclusive items in Los Santos.",
      videoThumb: trailerThumb,
    },
    {
      image: gta2,
      logo: "HEIST",
      subtitle: "ULTIMATE ARSENAL",
      title: "EXECUTE THE PERFECT HEIST",
      description: "Gear up for the biggest scores in GTA Online history. With AECOIN packages, you gain instant access to military-grade weapons, armored vehicles, and cutting-edge technology. Build your criminal empire with the resources needed to pull off legendary heists.",
      videoThumb: trailerThumb,
    },
    {
      image: gta3,
      logo: "EMPIRE",
      subtitle: "BUILD YOUR LEGACY",
      title: "RULE THE STREETS",
      description: "From street corners to penthouse suites - transform your GTA experience with unlimited purchasing power. AECOIN packages provide the financial foundation to establish your criminal organization, recruit crew members, and dominate every business venture in Los Santos.",
      videoThumb: trailerThumb,
    },
    {
      image: gta4,
      logo: "LUXURY",
      subtitle: "PREMIUM LIFESTYLE",
      title: "LIVE LIKE ROYALTY",
      description: "Experience the pinnacle of luxury in GTA Online. With AECOIN, unlock exclusive penthouses, rare supercars, and VIP memberships. Join the elite class of Los Santos and showcase your wealth through premium properties, designer vehicles, and high-end customization options.",
      videoThumb: trailerThumb,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <section className="relative h-screen bg-[#000000] overflow-hidden">
      {/* Full Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
          {/* Fallback to image if video doesn't load */}
          <img 
            src={currentSlideData.image} 
            alt="GTA Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
      </div>

      <div className="container mx-auto px-8 h-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 h-full items-center">
          {/* Left Content */}
          <div 
            className="space-y-4 max-w-2xl pt-16"
            key={`content-${currentSlide}`}
            style={{ animation: "slideInLeft 0.6s ease-out" }}
          >
            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas text-white leading-none tracking-wide uppercase">
              <div className="mb-2">{currentSlideData.logo}</div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-rajdhani font-bold tracking-wider">
                <TypingText text={currentSlideData.subtitle} speed={80} />
              </div>
            </h1>

            {/* About Section */}
            <div className="space-y-4 pt-2">
              <h2 className="text-white font-bebas text-2xl tracking-widest uppercase">
                ABOUT THE GAME
              </h2>
              <p className="text-gray-300 text-base md:text-lg font-rajdhani leading-relaxed">
                {currentSlideData.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap gap-4">
              <Button
                onClick={onShopClick}
                className="bg-neon-yellow hover:bg-neon-yellow/90 text-black font-bold text-sm px-10 h-14 uppercase font-rajdhani tracking-widest shadow-2xl"
                data-testid="button-buy-coins"
              >
                BUY COINS
              </Button>
              <Button
                onClick={onRankingsClick}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-bold text-sm px-10 h-14 uppercase font-rajdhani tracking-widest"
                data-testid="button-explore-rankings"
              >
                EXPLORE RANKINGS
              </Button>
            </div>
          </div>

          {/* Right Content - Video Section */}
          <div 
            className="flex items-center justify-end"
            key={`video-${currentSlide}`}
            style={{ animation: "fadeIn 0.8s ease-out 0.3s both" }}
          >
            <div className="space-y-4">
              <h3 className="text-white font-bebas text-xl tracking-widest uppercase text-right">
                RELEASE TRAILER
              </h3>
              <a 
                href="https://youtu.be/tV95N0TIltc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-80 h-52 rounded-lg overflow-hidden group cursor-pointer shadow-2xl border-2 border-white/20 block"
                data-testid="link-release-trailer"
              >
                <img 
                  src={currentSlideData.videoThumb} 
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-neon-yellow transition-all duration-300 flex items-center justify-center shadow-xl">
                    <Play className="w-7 h-7 text-black ml-1" fill="currentColor" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side Navigation Dots */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index 
                ? "bg-white w-3 h-12" 
                : "bg-white/40 w-3 h-3 hover:bg-white/60"
            }`}
            data-testid={`indicator-${index}`}
          />
        ))}
      </div>


      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
