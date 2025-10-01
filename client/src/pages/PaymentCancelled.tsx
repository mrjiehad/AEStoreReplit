import { Link } from "wouter";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gray-500/20 blur-2xl rounded-full"></div>
            <XCircle
              className="w-16 h-16 text-gray-400 relative"
              data-testid="icon-cancelled"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h1
            className="text-3xl font-bold text-white"
            data-testid="text-title"
          >
            Payment Cancelled
          </h1>
          <p className="text-gray-400 text-lg" data-testid="text-description">
            You cancelled the payment process
          </p>
        </div>

        <div className="bg-zinc-900 border border-gray-700 rounded-lg p-6 space-y-4">
          <p className="text-sm text-gray-400">
            No charges have been made to your account. Your cart items are still saved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1"
              data-testid="button-back-home"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            
            <Button
              asChild
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              style={{ boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)" }}
              data-testid="button-try-again"
            >
              <Link href="/checkout">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Try Again
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-600">
          Need help? Contact our support team 24/7
        </p>
      </div>
    </div>
  );
}
