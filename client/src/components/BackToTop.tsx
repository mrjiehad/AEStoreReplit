import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const rafRef = useRef<number>();

  useEffect(() => {
    const toggleVisibility = () => {
      // Cancel any pending rAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use requestAnimationFrame to throttle state updates
      rafRef.current = requestAnimationFrame(() => {
        const shouldShow = window.scrollY > 500;
        setIsVisible(prev => prev !== shouldShow ? shouldShow : prev);
      });
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // If reduced motion, skip entrance/exit animations
  if (shouldReduceMotion) {
    return isVisible ? (
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={scrollToTop}
          size="icon"
          className="w-12 h-12 rounded-full bg-neon-yellow hover:bg-neon-yellow/90 text-black shadow-lg"
          style={{ boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)" }}
          data-testid="button-back-to-top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="w-12 h-12 rounded-full bg-neon-yellow hover:bg-neon-yellow/90 text-black shadow-lg"
            style={{ boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)" }}
            data-testid="button-back-to-top"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
