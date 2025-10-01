import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GallerySectionProps {
  images: string[];
  onCtaClick?: () => void;
}

export function GallerySection({ images, onCtaClick }: GallerySectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-black text-center mb-12 md:mb-16 tracking-tight uppercase text-neon-yellow px-4"
          data-testid="text-gallery-title"
        >
          GTA GALLERY
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12 px-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-md overflow-hidden cursor-pointer transition-all duration-300"
              style={{
                border: hoveredIndex === index ? "2px solid #FFD700" : "2px solid transparent",
                boxShadow: hoveredIndex === index ? "0 0 30px rgba(255, 215, 0, 0.6)" : "none",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              data-testid={`img-gallery-${index}`}
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={onCtaClick}
            className="w-full sm:w-auto bg-neon-yellow hover:bg-neon-yellow text-black font-bold text-base md:text-lg px-8 md:px-12 py-5 md:py-6 transition-all uppercase mx-4"
            data-testid="button-get-aecoin"
          >
            GET YOUR AECOIN NOW
          </Button>
        </div>
      </div>
    </section>
  );
}
