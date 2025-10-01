import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Cyberpunk_cityscape_hero_background_172a86dd.png";
import coinImage from "@assets/generated_images/Golden_coins_package_visual_49569ac5.png";

interface HeroSectionProps {
  onShopClick?: () => void;
  onGalleryClick?: () => void;
}

export function HeroSection({ onShopClick, onGalleryClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />

      <div className="absolute top-1/3 left-1/4 animate-float opacity-30">
        <img src={coinImage} alt="" className="w-16 h-16 animate-pulse-glow" />
      </div>
      <div className="absolute top-1/2 right-1/3 animate-float opacity-20" style={{ animationDelay: "1s" }}>
        <img src={coinImage} alt="" className="w-12 h-12 animate-pulse-glow" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 animate-float opacity-25" style={{ animationDelay: "2s" }}>
        <img src={coinImage} alt="" className="w-20 h-20 animate-pulse-glow" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bungee mb-6 tracking-wide"
          style={{
            color: "#FFD700",
            textShadow: "0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.6), 0 0 90px rgba(255, 215, 0, 0.4)",
          }}
          data-testid="text-hero-title"
        >
          AECOIN STORE
        </h1>
        <p className="text-xl md:text-2xl text-foreground mb-12 font-montserrat font-medium" data-testid="text-hero-subtitle">
          Your #1 Source for GTA Online Currency
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={onShopClick}
            className="bg-neon-yellow hover:bg-neon-yellow text-black font-bold text-lg px-8 py-6 border-2 border-neon-yellow/50 transition-all"
            style={{
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
            }}
            data-testid="button-shop-now"
          >
            SHOP NOW
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onGalleryClick}
            className="bg-transparent hover:bg-transparent border-2 border-neon-yellow text-neon-yellow font-bold text-lg px-8 py-6 backdrop-blur-sm transition-all"
            style={{
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
            }}
            data-testid="button-view-gallery"
          >
            VIEW GALLERY
          </Button>
        </div>
      </div>
    </section>
  );
}
