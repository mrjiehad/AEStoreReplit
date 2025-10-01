import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useState, useRef } from "react";

export interface Package {
  id: string;
  amount: number;
  price: number;
  originalPrice: number;
  image: string;
  badge?: string;
}

interface PackageCardProps {
  package: Package;
  onAddToCart?: (pkg: Package) => void;
}

function PackageCardContent({ pkg, onAddToCart }: { pkg: Package; onAddToCart?: (pkg: Package) => void }) {
  return (
    <>
      {/* Image Background */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
        <img
          src={pkg.image}
          alt={`${pkg.amount} AECOIN`}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          data-testid={`img-package-${pkg.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1d35] via-transparent to-transparent" />
        
        {/* Badge */}
        {pkg.badge && (
          <div
            className="absolute top-4 right-4 bg-neon-yellow text-black font-bold text-xs px-3 py-1 rounded-full uppercase"
            data-testid={`badge-package-${pkg.id}`}
          >
            {pkg.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <CardHeader className="pb-2 pt-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="text-5xl font-bebas text-white tracking-wider" data-testid={`text-package-amount-${pkg.id}`}>
              {pkg.amount.toLocaleString()}
            </div>
            <div className="flex flex-col items-start">
              <div className="text-lg font-bebas text-neon-yellow" style={{ textShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }}>
                +50
              </div>
              <div className="text-[10px] font-rajdhani text-neon-yellow uppercase tracking-wide -mt-1">
                BONUS
              </div>
            </div>
          </div>
          <div className="text-sm font-rajdhani text-gray-400 uppercase tracking-widest mt-1">
            AECOIN
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-3xl font-bold text-neon-yellow" data-testid={`text-price-${pkg.id}`}>
              RM{pkg.price}
            </span>
            <span className="text-base text-gray-500 line-through" data-testid={`text-original-price-${pkg.id}`}>
              RM{pkg.originalPrice}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6">
        <Button
          className="w-full bg-neon-yellow hover:bg-neon-yellow/90 text-black font-bold uppercase text-sm h-12 rounded-full font-rajdhani tracking-wide shadow-lg shadow-neon-yellow/20"
          onClick={() => onAddToCart?.(pkg)}
          data-testid={`button-add-to-cart-${pkg.id}`}
        >
          BUY NOW
        </Button>
      </CardFooter>
    </>
  );
}

export function PackageCard({ package: pkg, onAddToCart }: PackageCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number>();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Calculate rotation based on mouse position (subtle tilt)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !boundsRef.current) return;
    
    // Cancel any pending rAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    // Use requestAnimationFrame to throttle updates
    rafRef.current = requestAnimationFrame(() => {
      const bounds = boundsRef.current;
      if (!bounds) return;
      
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      
      // Normalize mouse position to -0.5 to 0.5 range
      const normalizedX = Math.max(-0.5, Math.min(0.5, (e.clientX - centerX) / bounds.width));
      const normalizedY = Math.max(-0.5, Math.min(0.5, (e.clientY - centerY) / bounds.height));
      
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    });
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    // Cache bounds on enter for better performance
    if (cardRef.current) {
      boundsRef.current = cardRef.current.getBoundingClientRect();
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    boundsRef.current = null;
    mouseX.set(0);
    mouseY.set(0);
    // Clean up any pending rAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  // If reduced motion, use regular Card without 3D effect
  if (shouldReduceMotion) {
    return (
      <Card
        className="group relative overflow-hidden bg-gradient-to-br from-[#1a2942] to-[#0d1d35] border-2 border-white/10 hover:border-neon-yellow/50 transition-all duration-300 rounded-3xl"
        style={{
          boxShadow: isHovered
            ? "0 0 30px rgba(255, 215, 0, 0.3), 0 20px 60px rgba(0, 0, 0, 0.5)"
            : "0 10px 30px rgba(0, 0, 0, 0.3)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid={`card-package-${pkg.id}`}
      >
        <PackageCardContent pkg={pkg} onAddToCart={onAddToCart} />
      </Card>
    );
  }

  // With 3D tilt effect
  return (
    <div style={{ perspective: "800px" }} className="rounded-3xl">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
          willChange: "transform",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="rounded-3xl"
      >
        <Card
          className="group relative overflow-hidden bg-gradient-to-br from-[#1a2942] to-[#0d1d35] border-2 border-white/10 hover:border-neon-yellow/50 transition-all duration-300 rounded-3xl"
          style={{
            boxShadow: isHovered
              ? "0 0 30px rgba(255, 215, 0, 0.3), 0 20px 60px rgba(0, 0, 0, 0.5)"
              : "0 10px 30px rgba(0, 0, 0, 0.3)",
          }}
          data-testid={`card-package-${pkg.id}`}
        >
          <PackageCardContent pkg={pkg} onAddToCart={onAddToCart} />
        </Card>
      </motion.div>
    </div>
  );
}
