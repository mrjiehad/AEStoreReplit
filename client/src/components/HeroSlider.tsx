import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage1 from "@assets/generated_images/Cyberpunk_cityscape_hero_background_172a86dd.png";
import heroImage2 from "@assets/generated_images/GTA_style_sports_car_7f8331d4.png";
import heroImage3 from "@assets/generated_images/Neon_arcade_machine_755a81ea.png";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  cta1: string;
  cta2: string;
}

const slides: Slide[] = [
  {
    image: heroImage1,
    title: "GET AECOIN NOW",
    subtitle: "Instant Delivery • Secure Payment • Best Prices",
    cta1: "SHOP NOW",
    cta2: "VIEW PACKAGES",
  },
  {
    image: heroImage2,
    title: "LEVEL UP YOUR GAME",
    subtitle: "Exclusive Deals • Fast Transactions • 24/7 Support",
    cta1: "BUY COINS",
    cta2: "LEARN MORE",
  },
  {
    image: heroImage3,
    title: "SAVE UP TO 11%",
    subtitle: "Limited Time Offers • Premium Service • Instant Access",
    cta1: "GET STARTED",
    cta2: "SEE DEALS",
  },
];

interface HeroSliderProps {
  onShopClick?: () => void;
  onGalleryClick?: () => void;
}

export function HeroSlider({ onShopClick, onGalleryClick }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />

          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-black mb-4 md:mb-6 tracking-tight uppercase text-neon-yellow"
                data-testid={`text-slide-title-${index}`}
              >
                {slide.title}
              </h1>
              <p
                className="text-base md:text-xl lg:text-2xl text-foreground mb-8 md:mb-12 font-medium max-w-3xl mx-auto"
                data-testid={`text-slide-subtitle-${index}`}
              >
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={onShopClick}
                  className="w-full sm:w-auto bg-neon-yellow hover:bg-neon-yellow text-black font-bold text-base md:text-lg px-6 md:px-8 py-5 md:py-6 border-2 border-neon-yellow/50 uppercase"
                  data-testid={`button-cta1-${index}`}
                >
                  {slide.cta1}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onGalleryClick}
                  className="w-full sm:w-auto bg-black/30 hover:bg-black/40 border-2 border-neon-yellow/70 text-neon-yellow font-bold text-base md:text-lg px-6 md:px-8 py-5 md:py-6 backdrop-blur-sm uppercase"
                  data-testid={`button-cta2-${index}`}
                >
                  {slide.cta2}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-neon-yellow h-10 w-10 md:h-12 md:w-12"
        data-testid="button-prev-slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-neon-yellow h-10 w-10 md:h-12 md:w-12"
        data-testid="button-next-slide"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </Button>

      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 md:h-3 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 md:w-12 bg-neon-yellow"
                : "w-2 md:w-3 bg-white/50 hover:bg-white/80"
            }`}
            data-testid={`button-slide-indicator-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
