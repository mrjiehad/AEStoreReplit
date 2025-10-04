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

function CyclingTypingText({ phrases, speed = 80, pauseDuration = 2000 }: { phrases: string[]; speed?: number; pauseDuration?: number }) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingDuration = currentPhrase.length * speed;
    const totalDuration = typingDuration + pauseDuration;

    const timer = setTimeout(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [currentPhraseIndex, phrases, speed, pauseDuration]);

  return <TypingText text={phrases[currentPhraseIndex]} speed={speed} />;
}

import gta1 from "@assets/gta1_1759551121573.png";
import trailerThumb from "@assets/hqdefault_1759551446234.jpg";

interface ReferenceHeroProps {
  onShopClick?: () => void;
  onPackagesClick?: () => void;
  onRankingsClick?: () => void;
}

export function ReferenceHero({ onShopClick, onPackagesClick, onRankingsClick }: ReferenceHeroProps) {
  const subtitlePhrases = [
    "MODERN CURRENCY",
    "AE OFFICIAL",
    "PREMIUM REWARDS",
    "INSTANT DELIVERY"
  ];

  return (
    <section className="relative h-screen bg-[#000000] overflow-hidden">
      {/* Full Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${gta1})`,
          backgroundPosition: 'center center',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
      </div>

      <div className="container mx-auto px-8 h-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 h-full items-center">
          {/* Left Content */}
          <div 
            className="space-y-4 max-w-2xl pt-16"
            style={{ animation: "slideInLeft 0.6s ease-out" }}
          >
            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas text-white leading-none tracking-wide uppercase">
              <div className="mb-2">AECOIN</div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-rajdhani font-bold tracking-wider">
                <CyclingTypingText phrases={subtitlePhrases} speed={80} pauseDuration={2000} />
              </div>
            </h1>

            {/* About Section */}
            <div className="space-y-4 pt-2">
              <h2 className="text-white font-bebas text-2xl tracking-widest uppercase">
                ABOUT THE GAME
              </h2>
              <p className="text-gray-300 text-base md:text-lg font-rajdhani leading-relaxed">
                AECOIN is a premium virtual currency system designed specifically for GTA Online. Starting with instant delivery in 2025, it revolutionized in-game purchases. The most efficient way to acquire luxury vehicles, high-end properties, and exclusive items in Los Santos.
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
                  src={trailerThumb} 
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
