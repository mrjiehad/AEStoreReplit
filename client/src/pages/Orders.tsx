import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Package, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { Order } from "@shared/schema";

export default function Orders() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

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
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <header className="border-b-4 border-neon-yellow bg-gradient-to-r from-[#0d1d35] to-[#1a2942] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:text-neon-yellow"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shop
          </Button>
          <h1 className="text-3xl font-bebas text-neon-yellow uppercase tracking-wider">
            My Orders
          </h1>
          <div className="w-24" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Success Message (if just completed payment) */}
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/30 rounded-3xl mb-8">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bebas text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-300 font-rajdhani">
              Your order has been placed successfully. You will receive your AECOIN redemption codes via email shortly.
            </p>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bebas text-white uppercase tracking-wider mb-4">
            Order History
          </h2>

          {orders.length === 0 ? (
            <Card className="bg-gradient-to-br from-[#1a2942] to-[#0d1d35] border-2 border-white/10 rounded-3xl">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 font-rajdhani text-lg">
                  No orders yet. Your order history will appear here.
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="mt-6 bg-neon-yellow hover:bg-neon-yellow/90 text-black font-bold"
                  data-testid="button-shop-now"
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="bg-gradient-to-br from-[#1a2942] to-[#0d1d35] border-2 border-neon-yellow/30 rounded-3xl"
                  data-testid={`card-order-${order.id}`}
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-bebas text-white uppercase">
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-rajdhani">Status:</span>
                      <span className="text-white font-rajdhani capitalize">{order.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-rajdhani">Total:</span>
                      <span className="text-neon-yellow font-rajdhani font-bold">
                        RM{parseFloat(order.finalAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-rajdhani">Date:</span>
                      <span className="text-white font-rajdhani">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
