import { ShoppingBag, CreditCard, Zap, Gamepad2 } from "lucide-react";
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
    <section className="min-h-screen bg-[#000000] flex items-center py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-3">
          <span className="text-neon-yellow font-rajdhani font-semibold text-sm tracking-widest uppercase">
            SIMPLE PROCESS
          </span>
        </div>

        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-bebas text-center mb-4 tracking-wider uppercase text-white"
          data-testid="text-how-it-works-title"
        >
          HOW IT WORKS
        </h2>

        <p className="text-center text-gray-300 font-rajdhani text-lg mb-16 max-w-3xl mx-auto">
          From purchase to playing – your journey to Los Santos dominance in four simple steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center" data-testid={`step-${index}`}>
              <div className="text-neon-yellow/30 font-bebas text-6xl mb-4">
                {step.number}
              </div>

              <div className="w-16 h-16 mx-auto mb-6 bg-neon-yellow/10 border border-neon-yellow/30 flex items-center justify-center">
                <step.icon className="w-8 h-8 text-neon-yellow" />
              </div>

              <h3 className="text-xl font-bebas text-white uppercase tracking-wide mb-3">
                {step.title}
              </h3>

              <p className="text-gray-400 font-rajdhani text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-to-r from-neon-yellow/10 to-neon-yellow/5 border border-neon-yellow/30 py-12 px-6">
          <h3 className="text-3xl md:text-4xl font-bebas text-white mb-3 uppercase">
            READY TO RULE AE OFFICIAL?
          </h3>
          <p className="text-gray-300 font-rajdhani text-lg mb-6">
            Join thousands of players who trust us for their AECOIN needs
          </p>
          <Button className="bg-neon-yellow hover:bg-neon-yellow/90 text-black font-rajdhani font-bold uppercase text-sm px-10 h-12">
            START YOUR EMPIRE NOW
          </Button>
        </div>
      </div>
    </section>
  );
}
