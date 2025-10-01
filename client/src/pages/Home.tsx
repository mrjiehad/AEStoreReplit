import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PackagesSection } from "@/components/PackagesSection";
import { GallerySection } from "@/components/GallerySection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import type { Package } from "@/components/PackageCard";
import type { FAQItem } from "@/components/FAQSection";

import coinImage from "@assets/generated_images/Golden_coins_package_visual_49569ac5.png";
import chestImage from "@assets/generated_images/Treasure_chest_with_coins_e01577f1.png";
import vipImage from "@assets/generated_images/Premium_VIP_card_df8b7c42.png";
import controllerImage from "@assets/generated_images/Neon_gaming_controller_c2d9ebdc.png";
import pcImage from "@assets/generated_images/Gaming_PC_setup_f3d4ef1a.png";
import arcadeImage from "@assets/generated_images/Neon_arcade_machine_755a81ea.png";
import carImage from "@assets/generated_images/GTA_style_sports_car_7f8331d4.png";

const packages: Package[] = [
  { id: "1", amount: 500, price: 60, originalPrice: 65, image: coinImage },
  { id: "2", amount: 1000, price: 98, originalPrice: 110, image: coinImage, badge: "POPULAR" },
  { id: "3", amount: 3000, price: 295, originalPrice: 310, image: chestImage },
  { id: "4", amount: 5000, price: 490, originalPrice: 510, image: chestImage, badge: "BEST VALUE" },
  { id: "5", amount: 10000, price: 980, originalPrice: 1000, image: vipImage },
];

const galleryImages = [
  controllerImage,
  pcImage,
  arcadeImage,
  carImage,
  coinImage,
  chestImage,
  controllerImage,
  pcImage,
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
      <HeroSection onShopClick={scrollToPackages} onGalleryClick={scrollToGallery} />
      <PackagesSection packages={packages} onAddToCart={handleAddToCart} />
      <GallerySection images={galleryImages} onCtaClick={scrollToPackages} />
      <HowItWorksSection />
      <FAQSection faqs={faqs} />
      <Footer />
    </div>
  );
}
