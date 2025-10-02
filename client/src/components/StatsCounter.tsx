import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Users, Coins, ShoppingBag } from "lucide-react";

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // If reduced motion preferred, show final value immediately
    if (shouldReduceMotion) {
      if (nodeRef.current) {
        nodeRef.current.textContent = value.toLocaleString();
      }
      return;
    }

    const animation = animate(count, value, { duration });
    
    return animation.stop;
  }, [value, duration, count, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const unsubscribe = rounded.on("change", (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = latest.toLocaleString();
      }
    });

    return () => unsubscribe();
  }, [rounded, shouldReduceMotion]);

  return <span ref={nodeRef}>{shouldReduceMotion ? value.toLocaleString() : ""}</span>;
}

export function StatsCounter() {
  const shouldReduceMotion = useReducedMotion();
  
  const stats = [
    {
      icon: Users,
      label: "Happy Customers",
      value: 15000,
      suffix: "+",
    },
    {
      icon: Coins,
      label: "AECOIN Delivered",
      value: 50000000,
      suffix: "+",
    },
    {
      icon: ShoppingBag,
      label: "Orders Completed",
      value: 25000,
      suffix: "+",
    },
  ];

  // If reduced motion, render without animations
  if (shouldReduceMotion) {
    return (
      <section className="py-16 bg-gradient-to-b from-[#000000] to-[#000000]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-black/20 border border-neon-yellow/20 hover:border-neon-yellow/50 transition-all duration-300"
                data-testid={`stat-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-neon-yellow/10 border border-neon-yellow/30 mb-4">
                  <stat.icon className="w-8 h-8 text-neon-yellow" />
                </div>
                <div className="text-4xl md:text-5xl font-bebas text-neon-yellow mb-2">
                  <Counter value={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-gray-400 font-rajdhani text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-[#000000] to-[#000000]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-black/20 border border-neon-yellow/20 hover:border-neon-yellow/50 transition-all duration-300"
              data-testid={`stat-${index}`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-neon-yellow/10 border border-neon-yellow/30 mb-4">
                <stat.icon className="w-8 h-8 text-neon-yellow" />
              </div>
              <div className="text-4xl md:text-5xl font-bebas text-neon-yellow mb-2">
                <Counter value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-gray-400 font-rajdhani text-sm uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
