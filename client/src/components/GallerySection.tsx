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
          className="text-4xl md:text-5xl lg:text-6xl font-bebas text-center mb-12 md:mb-16 tracking-wider uppercase text-neon-yellow px-4"
          data-testid="text-gallery-title"
        >
          GTA GALLERY
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12 px-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-sm overflow-hidden cursor-pointer transition-all duration-500 group"
              style={{
                border: hoveredIndex === index ? "2px solid #FFD700" : "2px solid transparent",
                boxShadow: hoveredIndex === index ? "0 0 20px rgba(255, 215, 0, 0.5)" : "none",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              data-testid={`img-gallery-${index}`}
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={onCtaClick}
            className="w-full sm:w-auto bg-neon-yellow hover:bg-neon-yellow hover:scale-105 text-black font-bold text-sm px-10 h-10 transition-transform uppercase mx-4 rounded-sm font-rajdhani tracking-wide"
            data-testid="button-get-aecoin"
          >
            GET YOUR AECOIN NOW
          </Button>
        </div>
      </div>
    </section>
  );
}
