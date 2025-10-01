import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Wallet, Tag, Loader2 } from "lucide-react";
import { SiStripe } from "react-icons/si";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CartItem, Package, Coupon } from "@shared/schema";

// Initialize Stripe (from blueprint:javascript_stripe)
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CartItemWithPackage extends CartItem {
  package: Package;
}

// Stripe Checkout Form Component (from blueprint:javascript_stripe)
function StripeCheckoutForm({ 
  total, 
  paymentIntentId,
  onSuccess 
}: { 
  total: number; 
  paymentIntentId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Complete order creation on backend
        const response = await apiRequest("POST", "/api/orders/complete", {
          paymentIntentId: paymentIntent.id,
        });
        
        const data = await response.json();
        
        if (data.success) {
          toast({
            title: "Payment Successful!",
            description: "Your order has been placed successfully.",
          });
          onSuccess();
        } else {
          toast({
            title: "Order Error",
            description: "Payment successful but order creation failed. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "An error occurred during payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-neon-yellow text-black hover:bg-neon-yellow/90 font-bold"
        data-testid="button-submit-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay RM{Math.round(total)}
          </>
        )}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "toyyibpay">("stripe");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");

  // Check for error query parameter and redirect BEFORE anything else
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  
  if (error === 'payment_failed') {
    navigate('/payment/failed');
    return null;
  } else if (error === 'payment_cancelled') {
    navigate('/payment/cancelled');
    return null;
  }

  // Fetch cart items (only if user is authenticated)
  const { data: cartItems = [], isLoading } = useQuery<CartItemWithPackage[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });

  // Validate coupon mutation
  const validateCoupon = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("GET", `/api/coupons/${code}?subtotal=${subtotal}`);
      return await response.json();
    },
    onSuccess: (data: Coupon) => {
      // Check minimum purchase on frontend as well
      if (data.minPurchase && parseFloat(data.minPurchase) > subtotal) {
        toast({
          title: "Coupon Not Applicable",
          description: `Minimum purchase of RM${data.minPurchase} required.`,
          variant: "destructive",
        });
        return;
      }
      
      setAppliedCoupon(data);
      const discountText = data.discountType === 'percentage' 
        ? `${data.discountValue}% discount` 
        : `RM${data.discountValue} discount`;
      toast({
        title: "Coupon Applied!",
        description: `${discountText} applied successfully.`,
      });
    },
    onError: (error: any) => {
      const message = error.message || "The coupon code you entered is invalid or expired.";
      toast({
        title: "Invalid Coupon",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.package.price) * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon 
    ? appliedCoupon.discountType === 'percentage'
      ? (subtotal * parseFloat(appliedCoupon.discountValue)) / 100
      : parseFloat(appliedCoupon.discountValue)
    : 0;

  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      validateCoupon.mutate(couponCode.trim().toUpperCase());
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  // Create payment intent when checkout with Stripe (from blueprint:javascript_stripe)
  // Server calculates amount for security - never trust client input
  // CRITICAL: Regenerate when total changes to prevent underpayment via stale intents
  useEffect(() => {
    if (paymentMethod === "stripe" && cartItems.length > 0) {
      // Clear old client secret to force re-render
      setClientSecret("");
      
      apiRequest("POST", "/api/create-payment-intent", { 
        couponCode: appliedCoupon?.code || "",
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId || "");
          // Server returns the calculated amount for display verification
          if (data.amount && Math.abs(data.amount - total) > 0.01) {
            toast({
              title: "Price Mismatch",
              description: "Cart total has changed. Please review your order.",
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          console.error("Payment intent error:", error);
          toast({
            title: "Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [paymentMethod, appliedCoupon, total, cartItems.length]);

  const handlePaymentSuccess = () => {
    // Clear cart and redirect to orders page
    queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    navigate("/orders");
  };

  const [isProcessingToyyibPay, setIsProcessingToyyibPay] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "toyyibpay") {
      setIsProcessingToyyibPay(true);
      
      try {
        const response = await apiRequest("POST", "/api/create-toyyibpay-bill", {
          couponCode: appliedCoupon?.code || "",
        });
        
        const data = await response.json();
        
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          toast({
            title: "Error",
            description: "Failed to create payment. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Payment Error",
          description: error.message || "Failed to initialize ToyyibPay payment.",
          variant: "destructive",
        });
      } finally {
        setIsProcessingToyyibPay(false);
      }
    }
  };

  if (!user) {
    navigate("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-yellow animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] pb-12">
      {/* Header */}
      <div className="bg-[#0d1d35] border-b border-white/10 py-6">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:text-neon-yellow mb-4"
            data-testid="button-back-to-shop"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
          <h1 className="text-4xl font-bebas text-white uppercase tracking-wider">
            Checkout
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method */}
            <Card className="bg-gradient-to-br from-[#1a2942] to-[#0d1d35] border-2 border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bebas text-white uppercase tracking-wider">
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod("stripe")}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      paymentMethod === "stripe"
                        ? "border-neon-yellow bg-neon-yellow/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    data-testid="button-payment-stripe"
                  >
                    <SiStripe className="w-12 h-12 mx-auto mb-3 text-[#635BFF]" />
                    <p className="font-rajdhani font-bold text-white text-center">
                      Stripe
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      Cards, Wallets
                    </p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("toyyibpay")}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      paymentMethod === "toyyibpay"
                        ? "border-neon-yellow bg-neon-yellow/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    data-testid="button-payment-toyyibpay"
                  >
                    <Wallet className="w-12 h-12 mx-auto mb-3 text-neon-yellow" />
                    <p className="font-rajdhani font-bold text-white text-center">
                      ToyyibPay
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      FPX, Online Banking
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="bg-gradient-to-br from-[#1a2942] to-[#0d1d35] border-2 border-neon-yellow/30 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bebas text-white uppercase tracking-wider">
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Payment Form (from blueprint:javascript_stripe) */}
                {paymentMethod === "stripe" && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripeCheckoutForm 
                      total={total}
                      paymentIntentId={paymentIntentId}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                ) : paymentMethod === "stripe" && !clientSecret ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-neon-yellow animate-spin" />
                    <span className="ml-2 text-white">Initializing payment...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-400 text-sm text-center py-8">
                      You will be redirected to ToyyibPay to complete your payment
                    </p>
                    <Button
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0 || isProcessingToyyibPay}
                      className="w-full bg-neon-yellow hover:bg-neon-yellow/90 text-black font-bold uppercase text-base h-12 rounded-full font-rajdhani tracking-wide"
                      data-testid="button-place-order"
                    >
                      {isProcessingToyyibPay ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Redirecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-5 h-5 mr-2" />
                          Continue to ToyyibPay
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <p className="text-xs text-gray-400 text-center mt-6">
                  By completing this purchase, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-[#1a2942] to-[#0d1d35] border-2 border-neon-yellow/30 rounded-3xl sticky top-4">
              <CardHeader>
                <CardTitle className="text-2xl font-bebas text-white uppercase tracking-wider">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-[#0a1628]/50 rounded-xl border border-white/5"
                      data-testid={`checkout-item-${item.id}`}
                    >
                      <div className="flex-1">
                        <h3 className="font-rajdhani font-bold text-white text-sm">
                          {item.package.name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {item.package.aecoinAmount.toLocaleString()} AECOIN × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-neon-yellow text-sm">
                          RM{(parseFloat(item.package.price) * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/10" />

                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-rajdhani font-semibold text-white mb-2">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Coupon Code
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-2xl">
                      <Badge className="bg-green-500 text-black font-bold">
                        {appliedCoupon.code}
                      </Badge>
                      <span className="text-sm text-green-400 flex-1">
                        {appliedCoupon.discountType === 'percentage' 
                          ? `${appliedCoupon.discountValue}% OFF` 
                          : `RM${appliedCoupon.discountValue} OFF`}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-red-400 hover:text-red-300 h-7"
                        data-testid="button-remove-coupon"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="bg-[#0a1628] border-white/10 text-white rounded-xl"
                        data-testid="input-coupon-code"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || validateCoupon.isPending}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-xl"
                        data-testid="button-apply-coupon"
                      >
                        {validateCoupon.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <Separator className="bg-white/10" />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-white">
                    <span className="font-rajdhani">Subtotal:</span>
                    <span data-testid="text-subtotal">RM{subtotal.toFixed(0)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-400">
                      <span className="font-rajdhani">
                        Discount{appliedCoupon.discountType === 'percentage' ? ` (${appliedCoupon.discountValue}%)` : ''}:
                      </span>
                      <span data-testid="text-discount">-RM{discountAmount.toFixed(0)}</span>
                    </div>
                  )}
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-white font-rajdhani">Total:</span>
                    <span className="text-neon-yellow" data-testid="text-total">
                      RM{total.toFixed(0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
