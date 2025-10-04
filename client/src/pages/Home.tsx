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
import gta1 from "@assets/gta1_1759562666071.png";
import gta2 from "@assets/gta2_1759562666072.png";
import gta3 from "@assets/gta3_1759562666074.png";
import gta4 from "@assets/gta4_1759562666075.png";
import gta5 from "@assets/GTA-5-Characters-GTA-6_1759562666076.png";
import gta6 from "@assets/gta6_1759562666077.png";
import gta7 from "@assets/gta7_1759562666078.png";
import gta8 from "@assets/gta8_1759562666079.png";

const galleryImages = [
  gta1,
  gta2,
  gta3,
  gta4,
  gta5,
  gta6,
  gta7,
  gta8,
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
    originalPrice: pkg.originalPrice ? Math.round(parseFloat(pkg.originalPrice)) : Math.round(parseFloat(pkg.price)),
    image: pkg.imageUrl || packageImages[index % packageImages.length],
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

  const goToRankings = () => {
    navigate("/rankings");
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <Header cartItemCount={cartItems.length} onCartClick={handleCartClick} />
      <ReferenceHero onShopClick={scrollToPackages} onPackagesClick={scrollToPackages} onRankingsClick={goToRankings} />
      
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
