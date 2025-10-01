import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Ticket } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  isActive: boolean;
  expiresAt: string | null;
  usageLimit: number | null;
  usageCount: number;
}

const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(50, "Code must be at most 50 characters")
    .regex(/^[A-Z0-9]+$/, "Code must be uppercase letters and numbers only"),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().min(0.01, "Discount must be greater than 0"),
  isActive: z.boolean(),
  expiresAt: z.string().optional(),
  usageLimit: z.coerce.number().min(1).optional(),
});

type CouponFormData = z.infer<typeof couponSchema>;

export default function AdminCoupons() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const { data: coupons, isLoading } = useQuery<Coupon[]>({
    queryKey: ["/api/admin/coupons"],
    enabled: !!user?.isAdmin,
  });

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: 0,
      isActive: true,
      expiresAt: undefined,
      usageLimit: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CouponFormData) => {
      return apiRequest("POST", "/api/admin/coupons", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      toast({
        title: "Coupon Created",
        description: "The coupon has been created successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create coupon.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CouponFormData }) => {
      return apiRequest("PATCH", `/api/admin/coupons/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      toast({
        title: "Coupon Updated",
        description: "The coupon has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingCoupon(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update coupon.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      toast({
        title: "Coupon Deleted",
        description: "The coupon has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete coupon.",
        variant: "destructive",
      });
    },
  });

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-zinc-900 border-yellow-500/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bebas text-yellow-400 mb-4">ACCESS DENIED</h2>
            <p className="text-zinc-400">Administrator access required</p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4"
              data-testid="button-home"
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    form.reset({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: parseFloat(coupon.discountValue),
      isActive: coupon.isActive,
      expiresAt: coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().slice(0, 16)
        : undefined,
      usageLimit: coupon.usageLimit || undefined,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCoupon(null);
    form.reset();
  };

  const onSubmit = (data: CouponFormData) => {
    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isLimitReached = (coupon: Coupon) => {
    if (!coupon.usageLimit) return false;
    return coupon.usageCount >= coupon.usageLimit;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bebas text-yellow-400 mb-2">
              COUPON MANAGEMENT
            </h1>
            <p className="text-zinc-400">Create and manage discount coupons</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-yellow-400 text-black hover:bg-yellow-500"
                data-testid="button-create-coupon"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-yellow-500/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bebas text-yellow-400">
                  {editingCoupon ? "EDIT COUPON" : "CREATE COUPON"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-black border-zinc-700 uppercase"
                            placeholder="e.g., WELCOME10"
                            maxLength={50}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                            data-testid="input-code"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="bg-black border-zinc-700"
                              data-testid="select-type"
                            >
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount (RM)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Value</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            className="bg-black border-zinc-700"
                            placeholder="e.g., 10"
                            data-testid="input-value"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="datetime-local"
                            className="bg-black border-zinc-700"
                            data-testid="input-expiry"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usage Limit (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            className="bg-black border-zinc-700"
                            placeholder="e.g., 100"
                            data-testid="input-limit"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4"
                            data-testid="input-active"
                          />
                        </FormControl>
                        <FormLabel className="mb-0">Active</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      data-testid="button-submit-coupon"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? "Saving..."
                        : editingCoupon
                        ? "Update"
                        : "Create"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-zinc-900 border-yellow-500/20">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400" />
              </div>
            ) : coupons && coupons.length > 0 ? (
              <div className="space-y-4">
                {coupons.map((coupon) => {
                  const expired = isExpired(coupon.expiresAt);
                  const limitReached = isLimitReached(coupon);
                  const inactive = !coupon.isActive;
                  const disabled = expired || limitReached || inactive;

                  return (
                    <Card
                      key={coupon.id}
                      className="bg-black border-zinc-800 hover-elevate"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-2xl font-mono font-bold text-yellow-400">
                                {coupon.code}
                              </h3>
                              {coupon.isActive && !expired && !limitReached && (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                                  ACTIVE
                                </Badge>
                              )}
                              {inactive && (
                                <Badge className="bg-zinc-500/20 text-zinc-400 border-zinc-500/50">
                                  INACTIVE
                                </Badge>
                              )}
                              {expired && (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                                  EXPIRED
                                </Badge>
                              )}
                              {limitReached && (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                                  LIMIT REACHED
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-zinc-400">
                              <p>
                                Discount:{" "}
                                <span className="text-white font-semibold">
                                  {coupon.discountType === "percentage"
                                    ? `${coupon.discountValue}%`
                                    : `RM ${coupon.discountValue}`}
                                </span>
                              </p>
                              {coupon.expiresAt && (
                                <p>
                                  Expires:{" "}
                                  <span className="text-white">
                                    {new Date(coupon.expiresAt).toLocaleString()}
                                  </span>
                                </p>
                              )}
                              {coupon.usageLimit && (
                                <p>
                                  Usage:{" "}
                                  <span className="text-white">
                                    {coupon.usageCount} / {coupon.usageLimit}
                                  </span>
                                </p>
                              )}
                              {!coupon.usageLimit && coupon.usageCount > 0 && (
                                <p>
                                  Used:{" "}
                                  <span className="text-white">
                                    {coupon.usageCount} times
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                              onClick={() => handleEdit(coupon)}
                              data-testid={`button-edit-${coupon.id}`}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this coupon?"
                                  )
                                ) {
                                  deleteMutation.mutate(coupon.id);
                                }
                              }}
                              data-testid={`button-delete-${coupon.id}`}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-400">No coupons found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
