import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, DollarSign, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { vendorService } from "@/services/api";

interface DashboardStats {
  total_products: number;
  total_orders: number;
  pending_orders: number;
  processed_orders: number;
  total_earnings: number;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
}

interface RecentOrder {
  id: number;
  status: string;
  is_paid: boolean;
  total_price: string;
  created_at: string;
  items: OrderItem[];
}

const statusColor: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  processing: "text-blue-600 bg-blue-50 border-blue-200",
  shipped: "text-purple-600 bg-purple-50 border-purple-200",
  delivered: "text-green-600 bg-green-50 border-green-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
};

export default function VendorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          vendorService.getDashboard(),
          vendorService.getRecentOrders(),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  const statCards = stats ? [
    { label: "Total Products", value: String(stats.total_products), icon: Package, color: "text-primary" },
    { label: "Total Orders", value: String(stats.total_orders), icon: ShoppingCart, color: "text-success" },
    { label: "Processed Orders", value: String(stats.processed_orders), icon: Clock, color: "text-warning" },
    { label: "Total Earnings", value: `$${stats.total_earnings.toFixed(2)}`, icon: DollarSign, color: "text-primary" },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <s.icon className={`h-5 w-5 ${s.color} mb-3`} />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Recent Orders</h2>
        <Link to="/vendor-dashboard/orders" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No recent orders.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Order</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-3">
                    <Link to={`/vendor-dashboard/orders/${o.id}`} className="font-medium text-primary hover:underline">
                      ORD-{String(o.id).padStart(3, "0")}
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className={`capitalize text-xs ${statusColor[o.status] ?? ""}`}>
                      {o.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-medium">
                    ${parseFloat(o.total_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
