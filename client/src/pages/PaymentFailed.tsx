import { Link } from "wouter";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full"></div>
            <AlertCircle
              className="w-16 h-16 text-red-500 relative"
              data-testid="icon-failed"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h1
            className="text-3xl font-bold text-red-500"
            style={{ textShadow: "0 0 20px rgba(239, 68, 68, 0.5)" }}
            data-testid="text-title"
          >
            Payment Failed
          </h1>
          <p className="text-gray-400 text-lg" data-testid="text-description">
            We couldn't process your payment
          </p>
        </div>

        <div className="bg-zinc-900 border border-red-500/20 rounded-lg p-6 space-y-4">
          <div className="text-left space-y-2">
            <p className="text-sm font-semibold text-white">
              Common reasons for payment failure:
            </p>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li>Insufficient funds</li>
              <li>Card expired or blocked</li>
              <li>Incorrect card details</li>
              <li>Bank declined the transaction</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-600">
          Still having issues? Contact support and we'll help you out
        </p>
      </div>
    </div>
  );
}
