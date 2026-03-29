import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { orderService, paymentService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Package, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { baseURL } from "@/lib/axios";

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    image: string | null;
  } | null;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  status: string;
  is_paid: boolean;
  total_price: string;
  created_at: string;
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

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchOrders = async (page: number) => {
    setLoading(true);
    try {
      const res = await orderService.getAll(page);
      const data = res.data;
      setOrders(data.results);
      setNumPages(data.num_pages);
      setCurrentPage(data.current_page);
      setHasNext(data.has_next);
      setHasPrevious(data.has_previous);
    } catch {
      toast({ title: "Failed to load orders.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const goToPage = (page: number) => {
    fetchOrders(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayOrder = async (e: React.MouseEvent, orderId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setPayingOrderId(orderId);
    try {
      const callbackUrl = `${window.location.origin}/order-success`;
      const res = await paymentService.initialize([orderId], callbackUrl);
      if (res.data.authorization_url) {
        window.location.href = res.data.authorization_url;
      } else {
        throw new Error("No authorization URL returned.");
      }
    } catch {
      toast({ title: "Failed to initialize payment", variant: "destructive" });
      setPayingOrderId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm">Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">You haven't placed any orders yet.</p>
          <Link to="/shop"><Button size="sm" className="mt-4 rounded-xl">Start Shopping</Button></Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {orders.map(o => (
              <Link
                key={o.id}
                to={`/account/orders/${o.id}`}
                className="block bg-card rounded-xl border border-border p-5 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm">Order #{o.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <Badge variant="outline" className={statusColor(o.status) + " capitalize text-xs"}>
                    {o.status}
                  </Badge>
                </div>

                <div className="flex gap-2 mb-3">
                  {o.items.map(item => (
                    item.product?.image ? (
                      <img
                        key={item.id}
                        src={ `${baseURL}${item.product.image}`}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div key={item.id} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-border">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{o.items.length} item(s)</span>
                    <span className="font-semibold">${parseFloat(o.total_price).toFixed(2)}</span>
                  </div>
                  {!o.is_paid && o.status !== "cancelled" && (
                    <Button 
                      size="sm" 
                      onClick={(e) => handlePayOrder(e, o.id)}
                      disabled={payingOrderId === o.id}
                      className="rounded-lg h-8"
                    >
                      {payingOrderId === o.id && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
                      Pay Now
                    </Button>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {numPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Page {currentPage} of {numPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-8 text-xs"
                  disabled={!hasPrevious}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-8 text-xs"
                  disabled={!hasNext}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
