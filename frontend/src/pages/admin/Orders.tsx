import { orders } from "@/data/orders";
import { Badge } from "@/components/ui/badge";

export default function ManageOrders() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-medium text-muted-foreground">Order</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Items</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
            <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{o.orderNumber}</td>
                <td className="p-3 text-muted-foreground">{o.shippingAddress.name}</td>
                <td className="p-3">{o.items.length}</td>
                <td className="p-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-3"><Badge variant="outline" className="capitalize text-xs">{o.status}</Badge></td>
                <td className="p-3 text-right font-medium">${o.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
