import { ShoppingBag, CreditCard, Zap, Gamepad2, Target, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: ShoppingBag,
    title: "Choose Package",
    description: "Select your desired AECOIN package from our premium collection",
  },
  {
    number: "02",
    icon: CreditCard,
    title: "Secure Payment",
    description: "Pay safely with our trusted and encrypted payment gateway",
  },
  {
    number: "03",
    icon: Zap,
    title: "Instant Delivery",
    description: "Receive your activation codes immediately after payment",
  },
  {
    number: "04",
    icon: Gamepad2,
    title: "Redeem & Dominate",
    description: "Enter codes in GTA Online and start your criminal empire",
  },
];

export function HowItWorksSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-[#0d1d35] to-black flex items-center py-20 relative overflow-hidden">
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)',
        backgroundSize: '100px 100px',
      }} />

      {/* Floating Icons */}
      <Target className="absolute top-20 right-10 w-16 h-16 text-neon-yellow/10 animate-float" />
      <Rocket className="absolute bottom-20 left-20 w-20 h-20 text-neon-yellow/15 animate-float-delayed" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Label */}
        <div className="text-center mb-4">
          <div className="inline-block">
            <div className="text-neon-yellow font-rajdhani font-black text-sm tracking-[0.3em] uppercase px-8 py-4 border-4 border-neon-yellow/50 bg-neon-yellow/10 transform -skew-x-12">
              <span className="inline-block transform skew-x-12">SIMPLE PROCESS</span>
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
          data-testid="text-how-it-works-title"
        >
          HOW IT WORKS
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-300 font-rajdhani text-xl md:text-2xl mb-20 max-w-3xl mx-auto font-semibold">
          From purchase to playing – your journey to Los Santos dominance in four simple steps
        </p>

        {/* Steps Grid - More Dynamic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="group" data-testid={`step-${index}`}>
              <div className="relative bg-gradient-to-br from-neon-yellow/20 via-neon-yellow/10 to-transparent border-4 border-neon-yellow/50 rounded-3xl p-8 text-center transform hover:scale-110 hover:-rotate-2 transition-all duration-500 neon-border">
                {/* Number Badge */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-neon-yellow to-yellow-600 rounded-full flex items-center justify-center border-4 border-yellow-800 shadow-xl transform group-hover:rotate-12 transition-transform">
                  <span className="text-black font-bebas text-2xl">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-black/50 border-4 border-neon-yellow/50 flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                  <step.icon className="w-10 h-10 text-neon-yellow animate-pulse" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bebas text-neon-yellow uppercase tracking-wide mb-4 text-glow">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 font-rajdhani text-base leading-relaxed font-semibold">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section - Massive */}
        <div className="text-center bg-gradient-to-r from-neon-yellow/20 via-neon-yellow/10 to-neon-yellow/20 border-4 border-neon-yellow rounded-3xl py-16 px-8 relative overflow-hidden neon-border-strong">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-neon-yellow/10 via-transparent to-transparent blur-2xl" />
          
          <h3 className="text-4xl md:text-6xl font-bebas text-white mb-6 uppercase tracking-wider relative z-10 text-glow-strong">
            READY TO RULE LOS SANTOS?
          </h3>
          <p className="text-gray-300 font-rajdhani text-2xl mb-10 relative z-10 font-semibold">
            Join thousands of players who trust us for their AECOIN needs
          </p>
          <Button className="relative z-10 bg-gradient-to-r from-neon-yellow via-yellow-400 to-neon-yellow hover:from-yellow-400 hover:to-neon-yellow text-black font-black uppercase text-2xl px-16 h-20 rounded-2xl font-bebas tracking-widest shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-yellow-600 animate-gradient">
            <Zap className="w-8 h-8 mr-3 fill-current" />
            START YOUR EMPIRE NOW
          </Button>
        </div>
      </div>
    </section>
  );
}
