import { useState } from "react";
import { Header } from "@/components/Header";
import { ModernHero } from "@/components/ModernHero";
import { PackagesSection } from "@/components/PackagesSection";
import { GallerySection } from "@/components/GallerySection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import type { Package } from "@/components/PackageCard";
import type { FAQItem } from "@/components/FAQSection";

import coinImage from "@assets/stock_images/gold_coins_money_cas_b3778293.jpg";
import cashImage1 from "@assets/stock_images/money_cash_dollar_bi_d659bb42.jpg";
import cashImage2 from "@assets/stock_images/money_cash_dollar_bi_b379e39e.jpg";
import cashImage3 from "@assets/stock_images/money_cash_dollar_bi_99dbf87d.jpg";
import goldImage1 from "@assets/stock_images/treasure_gold_bars_v_9895e34c.jpg";
import goldImage2 from "@assets/stock_images/treasure_gold_bars_v_0d8d4f59.jpg";
import car1Image from "@assets/stock_images/gta_5_sports_car_mus_ecdea8c8.jpg";
import car2Image from "@assets/stock_images/gta_5_sports_car_mus_07d7cbe9.jpg";
import car3Image from "@assets/stock_images/gta_5_sports_car_mus_7250542e.jpg";
import bike1Image from "@assets/stock_images/gta_5_motorcycle_bik_bfe4c529.jpg";
import bike2Image from "@assets/stock_images/gta_5_motorcycle_bik_0e441d76.jpg";
import char1Image from "@assets/stock_images/gta_5_character_gang_408947e4.jpg";
import char2Image from "@assets/stock_images/gta_5_character_gang_e760f97e.jpg";
import cityImage from "@assets/stock_images/gta_5_los_santos_cit_cb9a6b5e.jpg";

const packages: Package[] = [
  { id: "1", amount: 500, price: 60, originalPrice: 65, image: coinImage },
  { id: "2", amount: 1000, price: 98, originalPrice: 110, image: cashImage1, badge: "POPULAR" },
  { id: "3", amount: 3000, price: 295, originalPrice: 310, image: cashImage2 },
  { id: "4", amount: 5000, price: 490, originalPrice: 510, image: goldImage1, badge: "BEST VALUE" },
  { id: "5", amount: 10000, price: 980, originalPrice: 1000, image: goldImage2 },
];

const galleryImages = [
  car1Image,
  bike1Image,
  char1Image,
  cityImage,
  car2Image,
  bike2Image,
  char2Image,
  car3Image,
];

const faqs: FAQItem[] = [
  {
    question: "How fast will I receive my codes?",
    answer: "Instantly after payment confirmation. Your AECOIN code will be delivered to your email within seconds.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept FPX, ToyyibPay, Billplz, Visa, and Mastercard for your convenience.",
  },
  {
    question: "Can I get a refund?",
    answer: "Refunds are only available for unused codes within 24 hours of purchase. Once redeemed, codes cannot be refunded.",
  },
  {
    question: "How do I redeem codes?",
    answer: "Simply enter your code in the GTA Online redeem menu to instantly add AECOIN to your account.",
  },
];

export default function Home() {
  const [cartItems, setCartItems] = useState<Package[]>([]);

  const handleAddToCart = (pkg: Package) => {
    setCartItems((prev) => [...prev, pkg]);
    console.log("Added to cart:", pkg);
  };

  const handleCartClick = () => {
    console.log("Cart opened. Items:", cartItems);
    alert(`Cart has ${cartItems.length} item(s)`);
  };

  const scrollToPackages = () => {
    const element = document.getElementById("packages");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToGallery = () => {
    const element = document.getElementById("gallery");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItems.length} onCartClick={handleCartClick} />
      <ModernHero onShopClick={scrollToPackages} onGalleryClick={scrollToGallery} />
      <PackagesSection packages={packages} onAddToCart={handleAddToCart} />
      <GallerySection images={galleryImages} onCtaClick={scrollToPackages} />
      <HowItWorksSection />
      <FAQSection faqs={faqs} />
      <Footer />
    </div>
  );
}
