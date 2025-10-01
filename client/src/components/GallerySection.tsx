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
          className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-16 tracking-wide"
          style={{
            color: "#FFD700",
            textShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
          }}
          data-testid="text-gallery-title"
        >
          GTA GALLERY
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
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
            className="bg-neon-yellow hover:bg-neon-yellow text-black font-bold text-lg px-12 py-6 transition-all"
            style={{
              boxShadow: "0 0 25px rgba(255, 215, 0, 0.5)",
            }}
            data-testid="button-get-aecoin"
          >
            GET YOUR AECOIN NOW
          </Button>
        </div>
      </div>
    </section>
  );
}
