import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, DollarSign, Loader2 } from "lucide-react";
import { adminAnalyticsService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from "recharts";

interface StatMetrics {
  total_vendors: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
}

interface ChartDataPoint {
  name: string;
  value: number;
}

interface DashboardData {
  metrics: StatMetrics;
  charts: {
    top_vendors: ChartDataPoint[];
    top_products: ChartDataPoint[];
    top_categories: ChartDataPoint[];
  };
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminAnalyticsService.getDashboardStats();
        setData(res.data);
      } catch (err: any) {
        toast({
          title: "Failed to load dashboard statistics",
          description: err.response?.data?.error || "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [toast]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p>Loading analytics...</p>
      </div>
    );
  }

  const { metrics, charts } = data;

  const statCards = [
    { label: "Total Vendors", value: metrics.total_vendors, icon: Users, color: "text-blue-500" },
    { label: "Total Products", value: metrics.total_products, icon: Package, color: "text-orange-500" },
    { label: "Total Orders", value: metrics.total_orders, icon: ShoppingCart, color: "text-green-500" },
    { label: "Revenue", value: `$${metrics.total_revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`, icon: DollarSign, color: "text-primary" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <s.icon className={`h-5 w-5 ${s.color} mb-3`} />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Top Vendors Bar Chart */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold mb-6">Top Vendors by Orders</h3>
          {charts.top_vendors.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">No data available yet.</p>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.top_vendors} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ecfccb" opacity={0.3} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={24}>
                    {charts.top_vendors.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Products Bar Chart */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold mb-6">Top Selling Products</h3>
          {charts.top_products.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">No data available yet.</p>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.top_products} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfccb" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(val) => val.substring(0, 10) + '...'} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Categories Pie Chart */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold mb-6">Units Sold by Category</h3>
          {charts.top_categories.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">No data available yet.</p>
          ) : (
            <div className="h-[350px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.top_categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {charts.top_categories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
