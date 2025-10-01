import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function PaymentPending() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/orders");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full"></div>
            <Loader2
              className="w-16 h-16 text-yellow-500 animate-spin relative"
              data-testid="icon-loading"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h1
            className="text-3xl font-bold text-yellow-500"
            style={{ textShadow: "0 0 20px rgba(255, 215, 0, 0.5)" }}
            data-testid="text-title"
          >
            Processing Payment
          </h1>
          <p className="text-gray-400 text-lg" data-testid="text-description">
            Please wait while we verify your payment...
          </p>
        </div>

        <div className="bg-zinc-900 border border-yellow-500/20 rounded-lg p-6">
          <p className="text-sm text-gray-500">
            This usually takes just a few seconds. You'll be redirected to your orders page automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
