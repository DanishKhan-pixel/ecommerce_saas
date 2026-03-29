import { Link } from "react-router-dom";
import { Package, MapPin, Star, ArrowRight } from "lucide-react";
import { orders } from "@/data/orders";

export default function AccountDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Orders", value: orders.length, icon: Package, to: "/account/orders" },
          { label: "Addresses", value: 2, icon: MapPin, to: "/account/addresses" },
          { label: "Reviews", value: 3, icon: Star, to: "/account/reviews" },
        ].map(s => (
          <Link key={s.label} to={s.to} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-muted-foreground" />
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-bold mt-3">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-semibold mb-4">Recent Orders</h2>
      <div className="space-y-3">
        {orders.slice(0, 3).map(o => (
          <Link key={o.id} to={`/account/orders/${o.id}`} className="flex items-center justify-between bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-all">
            <div>
              <p className="font-medium text-sm">{o.orderNumber}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm">${o.total.toFixed(2)}</p>
              <span className={`text-[11px] font-medium capitalize ${o.status === 'delivered' ? 'text-success' : o.status === 'shipped' ? 'text-primary' : 'text-muted-foreground'}`}>
                {o.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
