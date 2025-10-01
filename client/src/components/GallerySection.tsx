import { useState } from "react";
import { Eye, Star } from "lucide-react";

interface GallerySectionProps {
  images: string[];
  onCtaClick?: () => void;
}

const categories = [
  "All",
  "Vehicles",
  "Properties",
  "Weapons",
  "Heists",
  "Business",
  "Racing",
  "Territory",
  "Lifestyle",
];

const categoryLabels = [
  { category: "Vehicles", label: "Luxury Supercars" },
  { category: "Properties", label: "High-End Apartments" },
  { category: "Weapons", label: "Military Equipment" },
  { category: "Heists", label: "Criminal Operations" },
  { category: "Business", label: "Nightclub Empire" },
  { category: "Racing", label: "Street Racing" },
  { category: "Territory", label: "Gang Territory" },
  { category: "Lifestyle", label: "Penthouse Living" },
];

export function GallerySection({ images, onCtaClick }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <section id="gallery" className="min-h-screen bg-gradient-to-br from-[#0d1d35] via-black to-[#0d1d35] flex items-center py-20 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Floating Stars */}
      <Star className="absolute top-10 left-10 w-12 h-12 text-neon-yellow/10 animate-float fill-current" />
      <Star className="absolute bottom-20 right-20 w-16 h-16 text-neon-yellow/10 animate-float-delayed fill-current" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Label */}
        <div className="text-center mb-4">
          <div className="inline-block">
            <div className="text-neon-yellow font-rajdhani font-black text-sm tracking-[0.3em] uppercase px-8 py-4 border-4 border-neon-yellow/50 bg-neon-yellow/10 transform -skew-x-12">
              <span className="inline-block transform skew-x-12 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                SHOWCASE
                <Eye className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <h2
          className="text-5xl md:text-7xl lg:text-8xl font-bebas text-center mb-6 tracking-wider uppercase text-neon-yellow animate-neon-pulse"
          style={{
            textShadow: '0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFD700, 6px 6px 0px #000',
            WebkitTextStroke: '2px #FFD700',
          }}
          data-testid="text-gallery-title"
        >
          LOS SANTOS LIFESTYLE
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-300 font-rajdhani text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-semibold">
          See what awaits you in the most dangerous and lucrative city in the world
        </p>

        {/* Category Tabs - Gaming Style */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-3 font-bebas text-lg uppercase tracking-widest transition-all duration-300 transform hover:scale-110 border-4 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-neon-yellow to-yellow-500 text-black border-yellow-600 shadow-xl shadow-neon-yellow/50 rotate-0"
                  : "bg-black/50 text-gray-300 border-gray-700 hover:border-neon-yellow hover:text-neon-yellow -rotate-1 hover:rotate-0"
              }`}
              data-testid={`tab-${category.toLowerCase()}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid with Tilted Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {images.slice(0, 8).map((image, index) => {
            const labelData = categoryLabels[index % categoryLabels.length];
            return (
              <div
                key={index}
                className="group perspective-1000"
                data-testid={`img-gallery-${index}`}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transform hover:scale-110 hover:-rotate-3 transition-all duration-500 border-4 border-neon-yellow/30 hover:border-neon-yellow neon-border">
                  <img
                    src={image}
                    alt={labelData?.label || `Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                  />
                  {/* Overlay with Neon Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <div className="text-neon-yellow font-bebas text-sm font-bold uppercase tracking-widest mb-2 text-glow">
                        {labelData?.category}
                      </div>
                      <div className="text-white font-bebas text-2xl uppercase tracking-wide text-glow">
                        {labelData?.label}
                      </div>
                    </div>
                  </div>
                  {/* Corner Stars */}
                  <Star className="absolute top-2 right-2 w-4 h-4 text-neon-yellow opacity-0 group-hover:opacity-100 transition-opacity fill-current" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
