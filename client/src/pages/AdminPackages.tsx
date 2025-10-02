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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Edit, Trash2, Package } from "lucide-react";

interface Package {
  id: string;
  name: string;
  aecoinAmount: number;
  priceRM: string;
  description: string;
  isPopular: boolean;
}

const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  aecoinAmount: z.coerce.number().min(1, "Amount must be at least 1"),
  priceRM: z.coerce.number().min(1, "Price must be at least RM1"),
  description: z.string().min(1, "Description is required"),
  isPopular: z.boolean(),
});

type PackageFormData = z.infer<typeof packageSchema>;

export default function AdminPackages() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      aecoinAmount: 0,
      priceRM: 0,
      description: "",
      isPopular: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PackageFormData) => {
      return apiRequest("POST", "/api/admin/packages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({
        title: "Package Created",
        description: "The package has been created successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create package.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PackageFormData }) => {
      return apiRequest("PATCH", `/api/admin/packages/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({
        title: "Package Updated",
        description: "The package has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingPackage(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update package.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({
        title: "Package Deleted",
        description: "The package has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete package.",
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

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    form.reset({
      name: pkg.name,
      aecoinAmount: pkg.aecoinAmount,
      priceRM: parseFloat(pkg.priceRM),
      description: pkg.description,
      isPopular: pkg.isPopular,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPackage(null);
    form.reset();
  };

  const onSubmit = (data: PackageFormData) => {
    if (editingPackage) {
      updateMutation.mutate({ id: editingPackage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bebas text-yellow-400 mb-2">
              PACKAGE MANAGEMENT
            </h1>
            <p className="text-zinc-400">Create and manage AECOIN packages</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-yellow-400 text-black hover:bg-yellow-500"
                data-testid="button-create-package"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Package
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-yellow-500/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bebas text-yellow-400">
                  {editingPackage ? "EDIT PACKAGE" : "CREATE PACKAGE"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-black border-zinc-700"
                            placeholder="e.g., Starter Pack"
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aecoinAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AECOIN Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            className="bg-black border-zinc-700"
                            placeholder="e.g., 500"
                            data-testid="input-aecoin"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priceRM"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (RM)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            className="bg-black border-zinc-700"
                            placeholder="e.g., 50.00"
                            data-testid="input-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-black border-zinc-700"
                            placeholder="Package description..."
                            rows={3}
                            data-testid="input-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isPopular"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4"
                            data-testid="input-popular"
                          />
                        </FormControl>
                        <FormLabel className="mb-0">Mark as Popular</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      data-testid="button-submit-package"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? "Saving..."
                        : editingPackage
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
            ) : packages && packages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className="bg-black border-zinc-800 hover-elevate"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bebas text-yellow-400">
                              {pkg.name}
                            </h3>
                            {pkg.isPopular && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 mt-1">
                                POPULAR
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-3xl font-bold text-white">
                            {pkg.aecoinAmount.toLocaleString()}
                            <span className="text-sm text-yellow-400 ml-1">AECOIN</span>
                          </p>
                          <p className="text-2xl font-bold text-yellow-400">
                            RM {pkg.priceRM}
                          </p>
                        </div>
                        <p className="text-sm text-zinc-400">{pkg.description}</p>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                            onClick={() => handleEdit(pkg)}
                            data-testid={`button-edit-${pkg.id}`}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this package?"
                                )
                              ) {
                                deleteMutation.mutate(pkg.id);
                              }
                            }}
                            data-testid={`button-delete-${pkg.id}`}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-400">No packages found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
