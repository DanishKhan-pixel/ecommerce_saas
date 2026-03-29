import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Loader2 } from "lucide-react";
import { orderService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { baseURL } from "@/lib/axios";

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    image: string | null;
    slug: string;
    vendor?: { store_name: string };
  } | null;
  quantity: number;
  price: string;
  subtotal: number;
}

interface Order {
  id: number;
  status: string;
  is_paid: boolean;
  total_price: string;
  created_at: string;
  vendor: { store_name: string };
  items: OrderItem[];
}

const statusColor = (s: string) => {
  switch (s) {
    case 'delivered':  return 'bg-success/10 text-success border-success/20';
    case 'shipped':    return 'bg-primary/10 text-primary border-primary/20';
    case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'cancelled':  return 'bg-destructive/10 text-destructive border-destructive/20';
    default:           return 'bg-muted text-muted-foreground';
  }
};

const resolveImage = (image: string | null) =>
  image ? (image.startsWith("http") ? image : `${baseURL}${image}`) : null;

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await orderService.getById(id);
        setOrder(res.data);
      } catch {
        toast({ title: "Order not found.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-sm">Loading order details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground text-sm">Order not found.</p>
        <Link to="/account/orders" className="text-primary text-sm mt-2 inline-block">← Back to orders</Link>
      </div>
    );
  }

  const total = parseFloat(order.total_price);

  return (
    <div>
      <Link to="/account/orders" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            {" · "}
            <span className={order.is_paid ? "text-success" : "text-destructive"}>
              {order.is_paid ? "Paid" : "Unpaid"}
            </span>
          </p>
        </div>
        <Badge variant="outline" className={statusColor(order.status) + " capitalize text-xs"}>
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-sm mb-3">
            Items from {order.vendor?.store_name || "Vendor"}
          </h3>
          <div className="space-y-3">
            {order.items.map(item => {
              const img = resolveImage(item.product?.image ?? null);
              return (
                <div key={item.id} className="flex gap-3">
                  {img ? (
                    <img src={img} alt={item.product?.name ?? "Product"} className="w-14 h-14 rounded-lg object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product ? (
                        <Link to={`/product/${item.product.slug}`} className="hover:text-primary transition-colors">
                          {item.product.name}
                        </Link>
                      ) : "Deleted Product"}
                    </p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} · ${parseFloat(item.price).toFixed(2)} each</p>
                  </div>
                  <span className="text-sm font-medium shrink-0">${item.subtotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-sm mb-3">Order Summary</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-border mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
