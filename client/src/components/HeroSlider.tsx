import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage1 from "@assets/stock_images/gta_5_los_santos_cit_75686f5c.jpg";
import heroImage2 from "@assets/stock_images/gta_5_sports_car_mus_b25fc22c.jpg";
import heroImage3 from "@assets/stock_images/gta_5_los_santos_cit_829ca4e8.jpg";

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
    <section className="relative h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden">
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
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  onClick={onShopClick}
                  className="w-full sm:w-auto bg-neon-yellow hover:bg-neon-yellow text-black font-bold text-sm px-8 py-2 h-10 uppercase rounded-sm"
                  data-testid={`button-cta1-${index}`}
                >
                  {slide.cta1}
                </Button>
                <Button
                  variant="outline"
                  onClick={onGalleryClick}
                  className="w-full sm:w-auto bg-transparent hover:bg-neon-yellow/10 border border-neon-yellow text-neon-yellow font-bold text-sm px-8 py-2 h-10 uppercase rounded-sm"
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
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-neon-yellow h-9 w-9 rounded-sm"
        data-testid="button-prev-slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-neon-yellow h-9 w-9 rounded-sm"
        data-testid="button-next-slide"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-sm transition-all ${
              index === currentSlide
                ? "w-8 bg-neon-yellow"
                : "w-8 bg-white/30 hover:bg-white/60"
            }`}
            data-testid={`button-slide-indicator-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
