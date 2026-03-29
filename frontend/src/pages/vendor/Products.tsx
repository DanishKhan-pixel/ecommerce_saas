import { useState, useEffect } from "react";
import { vendorProductService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { baseURL } from "@/lib/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Product {
  id: string | number;
  name: string;
  category: { name: string } | null;
  price: string | number;
  stock: number;
  image: string;
}

export default function VendorProducts() {
  const [view, setView] = useState<"grid" | "table">("table");
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<string | number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await vendorProductService.getAll();
      setVendorProducts(res.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await vendorProductService.delete(productToDelete);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      setVendorProducts(vendorProducts.filter(p => p.id !== productToDelete));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setView("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Link to="/vendor-dashboard/products/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading products...</div>
      ) : vendorProducts.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border">
          <p>You haven't added any products yet.</p>
          <Link to="/vendor-dashboard/products/new">
            <Button size="sm" className="mt-4">
              <Plus className="h-4 w-4 mr-1" /> Add your first product
            </Button>
          </Link>
        </div>
      ) : view === "table" ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Price</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Stock</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendorProducts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`${baseURL}${p.image}` || "https://placehold.co/100x100"}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-muted"
                      />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.category?.name || "-"}</td>
                  <td className="p-3 font-medium">${Number(p.price).toFixed(2)}</td>
                  <td className="p-3">
                    <Badge variant={p.stock > 10 ? "secondary" : "destructive"} className="text-xs">
                      {p.stock}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/vendor-dashboard/products/${p.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setProductToDelete(p.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {vendorProducts.map((p) => (
            <div key={p.id} className="bg-card rounded-xl border border-border overflow-hidden">
              <img
                src={`${baseURL}${p.image}` || "https://placehold.co/400x400"}
                alt=""
                className="w-full aspect-square object-cover bg-muted"
              />
              <div className="p-4">
                <p className="font-medium text-sm truncate">{p.name}</p>
                <p className="text-sm font-bold mt-1">${Number(p.price).toFixed(2)}</p>
                <div className="flex gap-1 mt-3">
                  <Link to={`/vendor-dashboard/products/${p.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-destructive"
                    onClick={() => setProductToDelete(p.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={productToDelete !== null} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
