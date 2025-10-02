import { Shield, Zap, Headphones, CreditCard } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Bank-level encryption",
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Codes in seconds",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Always here to help",
    },
    {
      icon: CreditCard,
      title: "Trusted Payments",
      description: "Stripe & ToyyibPay",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-[#000000] to-[#000000]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-black/20 border border-white/5 hover:border-neon-yellow/30 transition-all duration-300 hover-elevate"
              data-testid={`badge-${index}`}
            >
              <div className="w-14 h-14 rounded-xl bg-neon-yellow/10 border border-neon-yellow/30 flex items-center justify-center mb-4">
                <badge.icon className="w-7 h-7 text-neon-yellow" />
              </div>
              <h3 className="text-white font-rajdhani font-bold text-sm uppercase mb-1">
                {badge.title}
              </h3>
              <p className="text-gray-400 text-xs font-rajdhani">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
