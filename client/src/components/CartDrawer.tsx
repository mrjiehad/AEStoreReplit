import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CartItem, Package } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

interface CartItemWithPackage extends CartItem {
  package: Package;
}

export function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { toast } = useToast();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery<CartItemWithPackage[]>({
    queryKey: ["/api/cart"],
    enabled: open,
  });

  // Update quantity mutation
  const updateQuantity = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      await apiRequest("PATCH", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    },
  });

  // Remove item mutation
  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed",
        description: "Item removed from cart",
      });
    },
  });

  // Calculate total
  const total = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.package.price) * item.quantity;
  }, 0);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-lg bg-[#000000] border-l border-white/10">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bebas text-white uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-neon-yellow" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-8rem)] mt-6">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Loading cart...
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-lg font-rajdhani text-white mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-400 mb-6">Add some AECOIN packages to get started!</p>
              <Button
                onClick={onClose}
                className="bg-neon-yellow hover:bg-neon-yellow/90 text-black font-bold uppercase rounded-full"
                data-testid="button-close-empty-cart"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a1a1a]/50 border border-white/10 rounded-2xl p-4"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h4 className="font-rajdhani font-bold text-white text-lg" data-testid={`text-cart-item-name-${item.id}`}>
                          {item.package.name}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {item.package.aecoinAmount.toLocaleString()} AECOIN
                        </p>
                        <p className="text-neon-yellow font-bold mt-2" data-testid={`text-cart-item-price-${item.id}`}>
                          RM{Math.round(parseFloat(item.package.price))}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem.mutate(item.id)}
                          className="text-red-400 hover:text-red-300 h-8 w-8"
                          data-testid={`button-remove-item-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-2 bg-[#000000] rounded-full p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity.mutate({ id: item.id, quantity: item.quantity - 1 });
                              }
                            }}
                            disabled={item.quantity <= 1}
                            className="h-7 w-7 rounded-full hover:bg-white/10"
                            data-testid={`button-decrease-quantity-${item.id}`}
                          >
                            <Minus className="w-3 h-3 text-white" />
                          </Button>
                          <span className="w-8 text-center font-bold text-white" data-testid={`text-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity.mutate({ id: item.id, quantity: item.quantity + 1 })}
                            className="h-7 w-7 rounded-full hover:bg-white/10"
                            data-testid={`button-increase-quantity-${item.id}`}
                          >
                            <Plus className="w-3 h-3 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-4 space-y-4">
                <Separator className="bg-white/10" />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-rajdhani font-semibold text-white">Total:</span>
                  <span className="text-2xl font-bold text-neon-yellow" data-testid="text-cart-total">
                    RM{Math.round(total)}
                  </span>
                </div>

                <Button
                  onClick={onCheckout}
                  className="w-full bg-neon-yellow hover:bg-neon-yellow/90 text-black font-bold uppercase text-base h-12 rounded-full font-rajdhani tracking-wide"
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
