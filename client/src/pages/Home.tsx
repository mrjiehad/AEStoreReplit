import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ReferenceHero } from "@/components/ReferenceHero";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { BackToTop } from "@/components/BackToTop";
import { PackagesSection } from "@/components/PackagesSection";
import { GallerySection } from "@/components/GallerySection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Package as DBPackage } from "@shared/schema";
import type { Package } from "@/components/PackageCard";
import type { FAQItem } from "@/components/FAQSection";

import coinImage from "@assets/stock_images/gold_coins_money_cas_b3778293.jpg";
import cashImage1 from "@assets/stock_images/money_cash_dollar_bi_d659bb42.jpg";
import cashImage2 from "@assets/stock_images/money_cash_dollar_bi_b379e39e.jpg";
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

// Map images to packages
const packageImages = [coinImage, cashImage1, cashImage2, goldImage1, goldImage2];

const faqs: FAQItem[] = [
  {
    question: "How fast will I receive my codes?",
    answer: "Instantly after payment confirmation. Your AECOIN code will be delivered to your email within seconds.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Stripe and ToyyibPay for your convenience.",
  },
  {
    question: "Can I get a refund?",
    answer: "Refunds are not available for digital codes. Please ensure you select the correct package before purchase.",
  },
  {
    question: "How do I redeem codes?",
    answer: "Simply enter your code in the GTA Online redeem menu to instantly add AECOIN to your account.",
  },
];

export default function Home() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartOpen, setCartOpen] = useState(false);

  // Fetch packages from API
  const { data: dbPackages = [] } = useQuery<DBPackage[]>({
    queryKey: ["/api/packages"],
  });

  // Fetch cart items to get count
  const { data: cartItems = [] } = useQuery<any[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });

  // Add to cart mutation with optimistic updates
  const addToCart = useMutation({
    mutationFn: async (packageId: string) => {
      await apiRequest("POST", "/api/cart", { packageId, quantity: 1 });
    },
    onMutate: async (packageId) => {
      // Find the package first
      const pkg = dbPackages.find(p => p.id === packageId);
      
      // If package not found, don't proceed with optimistic update
      if (!pkg) {
        return { previousCart: undefined };
      }

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["/api/cart"] });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(["/api/cart"]);

      // Optimistically update cart (add item for instant feedback)
      queryClient.setQueryData(["/api/cart"], (old: any[] = []) => [
        ...old,
        { 
          id: `temp-${Date.now()}`, 
          packageId, 
          quantity: 1,
          package: pkg 
        }
      ]);

      // Show instant success toast
      toast({
        title: "Added to Cart!",
        description: "Package added to your cart successfully.",
      });

      return { previousCart };
    },
    onError: (err: any, _packageId, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["/api/cart"], context.previousCart);
      }
      
      // Show appropriate error message
      const errorMessage = err?.message || "Failed to add item to cart. Please try again.";
      toast({
        title: "Failed to Add",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  // Convert DB packages to display format
  const packages: Package[] = dbPackages.map((pkg, index) => ({
    id: pkg.id,
    amount: pkg.aecoinAmount,
    price: Math.round(parseFloat(pkg.price)),
    originalPrice: Math.round(parseFloat(pkg.price) * 1.1), // 10% fake discount
    image: packageImages[index % packageImages.length],
    badge: pkg.featured ? "FEATURED" : undefined,
  }));

  const handleAddToCart = (pkg: Package) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in with Discord to add items to cart.",
        variant: "destructive",
      });
      return;
    }
    addToCart.mutate(pkg.id);
  };

  const handleCartClick = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to view your cart.",
        variant: "destructive",
      });
      return;
    }
    setCartOpen(true);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
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
    <div className="min-h-screen bg-[#0a1628]">
      <Header cartItemCount={cartItems.length} onCartClick={handleCartClick} />
      <ReferenceHero onShopClick={scrollToPackages} onPackagesClick={scrollToPackages} />
      
      <ScrollFadeIn delay={0.1}>
        <PackagesSection packages={packages} onAddToCart={handleAddToCart} />
      </ScrollFadeIn>
      
      <ScrollFadeIn delay={0.1}>
        <GallerySection images={galleryImages} onCtaClick={scrollToPackages} />
      </ScrollFadeIn>
      
      <ScrollFadeIn delay={0.1}>
        <HowItWorksSection />
      </ScrollFadeIn>
      
      <ScrollFadeIn delay={0.1}>
        <FAQSection faqs={faqs} />
      </ScrollFadeIn>
      
      <Footer />
      
      <BackToTop />
      
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
