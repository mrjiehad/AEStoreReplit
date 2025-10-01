import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Search, Package, DollarSign, Users, CheckCircle } from "lucide-react";

type OrderStatus = "created" | "paid" | "fulfilled" | "failed";

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  totalAmount: string;
  currency: string;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  orderItems: Array<{
    packageName: string;
    quantity: number;
    price: string;
  }>;
  redemptionCodes: Array<{
    code: string;
  }>;
}

export default function AdminOrders() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    enabled: !!user?.isAdmin,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      return apiRequest("PATCH", `/api/admin/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
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

  const filteredOrders = orders?.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      (order.userEmail?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.id?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: orders?.length || 0,
    paid: orders?.filter((o) => o.status === "paid" || o.status === "fulfilled").length || 0,
    revenue: orders
      ?.filter((o) => o.status === "paid" || o.status === "fulfilled")
      .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0)
      .toFixed(2) || "0.00",
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "fulfilled":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "paid":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "created":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-5xl font-bebas text-yellow-400 mb-2">
            ADMIN DASHBOARD
          </h1>
          <p className="text-zinc-400">Manage orders, packages, and coupons</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-zinc-900 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.total}</p>
                </div>
                <Package className="w-8 h-8 text-yellow-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Paid Orders</p>
                  <p className="text-3xl font-bold text-green-400">{stats.paid}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-cyan-400">RM{stats.revenue}</p>
                </div>
                <DollarSign className="w-8 h-8 text-cyan-400/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900 border-yellow-500/20 mb-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bebas text-yellow-400">
              ORDER MANAGEMENT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Search by email, name, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black border-zinc-700"
                  data-testid="input-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px] bg-black border-zinc-700" data-testid="select-status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400" />
              </div>
            ) : filteredOrders && filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="bg-black border-zinc-800 hover-elevate"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                              {order.paymentMethod}
                            </Badge>
                          </div>
                          <p className="text-sm text-zinc-400" data-testid={`text-order-id-${order.id}`}>
                            Order ID: {order.id}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-zinc-400" />
                            <span className="text-white">{order.userName}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400">{order.userEmail}</span>
                          </div>
                          <div className="text-sm text-zinc-400">
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                          <div className="space-y-1">
                            {order.orderItems?.map((item, idx) => (
                              <p key={idx} className="text-sm text-zinc-300">
                                {item.quantity}x {item.packageName} - {order.currency}{" "}
                                {item.price}
                              </p>
                            ))}
                          </div>
                          {order.redemptionCodes && order.redemptionCodes.length > 0 && (
                            <details className="text-sm">
                              <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300">
                                View Codes ({order.redemptionCodes.length})
                              </summary>
                              <div className="mt-2 space-y-1 pl-4">
                                {order.redemptionCodes.map((code, idx) => (
                                  <p key={idx} className="font-mono text-zinc-300">
                                    {code.code}
                                  </p>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-2xl font-bold text-yellow-400">
                            {order.currency} {order.totalAmount}
                          </p>
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              updateStatusMutation.mutate({
                                orderId: order.id,
                                status: value as OrderStatus,
                              })
                            }
                          >
                            <SelectTrigger
                              className="w-[150px] bg-zinc-800 border-zinc-700"
                              data-testid={`select-status-${order.id}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="created">Created</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="fulfilled">Fulfilled</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-400">No orders found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
