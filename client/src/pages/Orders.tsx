import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CheckCircle, 
  Package, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Copy,
  Check
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import type { Order, RedemptionCode } from "@shared/schema";

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: codes = [], isLoading: loadingCodes } = useQuery<RedemptionCode[]>({
    queryKey: [`/api/orders/${order.id}/codes`],
    enabled: expanded,
  });

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Copied!",
      description: "Redemption code copied to clipboard.",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Card
      className="bg-gradient-to-br from-[#1a2942] to-[#0d1d35] border-2 border-neon-yellow/30 rounded-3xl"
      data-testid={`card-order-${order.id}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bebas text-white uppercase">
            Order #{order.id.slice(0, 8)}
          </CardTitle>
          <Badge 
            className={`${
              order.status === 'completed' 
                ? 'bg-green-500' 
                : 'bg-yellow-500'
            } text-black font-bold`}
          >
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400 font-rajdhani">Total:</span>
            <p className="text-neon-yellow font-rajdhani font-bold text-lg">
              RM{Math.round(parseFloat(order.finalAmount))}
            </p>
          </div>
          <div>
            <span className="text-gray-400 font-rajdhani">Date:</span>
            <p className="text-white font-rajdhani">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {order.status === 'completed' && (
          <>
            <Separator className="bg-white/10" />
            <Button
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="w-full justify-between text-white hover:text-neon-yellow"
              data-testid={`button-toggle-codes-${order.id}`}
            >
              <span className="font-rajdhani">
                {expanded ? 'Hide' : 'View'} Redemption Codes
              </span>
              {expanded ? <ChevronUp /> : <ChevronDown />}
            </Button>

            {expanded && (
              <div className="space-y-2 pt-2">
                {loadingCodes ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-neon-yellow animate-spin" />
                  </div>
                ) : codes.length > 0 ? (
                  <>
                    <p className="text-xs text-gray-400 font-rajdhani mb-3">
                      Use these codes in GTA 5 to redeem your AECOIN:
                    </p>
                    {codes.map((code) => (
                      <div
                        key={code.id}
                        className="flex items-center justify-between bg-black/30 border border-neon-yellow/20 rounded-xl p-3"
                        data-testid={`code-${code.id}`}
                      >
                        <code className="text-neon-yellow font-mono text-sm">
                          {code.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCode(code.code)}
                          className="h-8 px-2 text-white hover:text-neon-yellow"
                          data-testid={`button-copy-${code.id}`}
                        >
                          {copiedCode === code.code ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-gray-400 text-sm font-rajdhani text-center py-4">
                    No redemption codes available.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

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
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
