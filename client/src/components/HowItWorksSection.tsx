import { ShoppingBag, CreditCard, Zap, Gamepad2, Shield, Headphones } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: ShoppingBag,
    title: "Choose Package",
    description: "Select your AECOIN amount",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Pay with trusted methods",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Get your code immediately",
  },
  {
    icon: Gamepad2,
    title: "Redeem & Play",
    description: "Use in GTA Online",
  },
];

const features = [
  {
    icon: Zap,
    title: "Instant Delivery",
    color: "#FFD700",
  },
  {
    icon: Shield,
    title: "100% Secure",
    color: "#00E0FF",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    color: "#FFD700",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-black text-center mb-12 md:mb-16 tracking-tight uppercase text-neon-yellow px-4"
          data-testid="text-how-it-works-title"
        >
          HOW IT WORKS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16 px-4">
          {steps.map((step, index) => (
            <div key={index} className="text-center" data-testid={`step-${index}`}>
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-neon-yellow/20 to-neon-cyan/20 border-2 border-neon-yellow"
                style={{
                  boxShadow: "0 0 30px rgba(255, 215, 0, 0.4)",
                }}
              >
                <step.icon className="w-10 h-10 text-neon-yellow" />
              </div>
              <h3 className="text-lg md:text-xl font-montserrat font-bold mb-2 text-foreground uppercase">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 px-4">
          {features.map((feature, index) => (
            <Badge
              key={index}
              className="px-6 py-3 text-base font-bold bg-card border-2 flex items-center gap-2"
              style={{
                borderColor: feature.color,
                color: feature.color,
                boxShadow: `0 0 20px ${feature.color}40`,
              }}
              data-testid={`feature-${index}`}
            >
              <feature.icon className="w-5 h-5" />
              {feature.title}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
