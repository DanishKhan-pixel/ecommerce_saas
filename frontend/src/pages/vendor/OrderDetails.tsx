import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { vendorOrderService } from "@/services/api";

interface Product {
  id: number;
  name: string;
  image: string | null;
  price: string;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string;
  subtotal: number;
}

interface CustomerAddress {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
}

interface VendorOrder {
  id: number;
  status: string;
  is_paid: boolean;
  total_price: string;
  created_at: string;
  customer_fullname: string;
  customer_address: CustomerAddress | null;
  items: OrderItem[];
}

const statusColor: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  processing: "text-blue-600 bg-blue-50 border-blue-200",
  shipped: "text-purple-600 bg-purple-50 border-purple-200",
  delivered: "text-green-600 bg-green-50 border-green-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
};

export default function VendorOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<VendorOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    vendorOrderService
      .getById(id)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Order not found or you don't have permission to view it."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading order…</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground mb-4">{error || "Order not found."}</p>
        <Link
          to="/vendor-dashboard/orders"
          className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/vendor-dashboard/orders"
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order ORD-{String(order.id).padStart(3, "0")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date(order.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {order.is_paid && (
            <Badge className="bg-green-50 text-green-700 border border-green-200 text-xs">
              Paid
            </Badge>
          )}
          <Badge
            variant="outline"
            className={`capitalize ${statusColor[order.status] ?? ""}`}
          >
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-sm mb-4">Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover border border-border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground">
                    No img
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                  </p>
                </div>
                <span className="text-sm font-medium shrink-0">
                  ${item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-sm">
            <span>Total</span>
            <span>${parseFloat(order.total_price).toFixed(2)}</span>
          </div>
        </div>

        {/* Customer & Address */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-sm mb-4">Customer</h3>
          <p className="font-medium text-sm">{order.customer_fullname}</p>

          {order.customer_address ? (
            <div className="mt-3 text-sm text-muted-foreground space-y-1">
              <p>{order.customer_address.address_line}</p>
              <p>
                {order.customer_address.city}, {order.customer_address.state}
              </p>
              <p>{order.customer_address.country}</p>
              {order.customer_address.phone && (
                <p className="mt-2 text-foreground text-xs font-medium">
                  📞 {order.customer_address.phone}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic mt-2">No address on file.</p>
          )}
        </div>
      </div>
    </div>
  );
}
