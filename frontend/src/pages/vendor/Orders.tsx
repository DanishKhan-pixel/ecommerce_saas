import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { vendorOrderService } from "@/services/api";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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
}

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColor: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  processing: "text-blue-600 bg-blue-50 border-blue-200",
  shipped: "text-purple-600 bg-purple-50 border-purple-200",
  delivered: "text-green-600 bg-green-50 border-green-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
};

export default function VendorOrders() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Search
  const [searchInput, setSearchInput] = useState("");
  const [customerName, setCustomerName] = useState("");

  // Status update modal
  const [updatingOrder, setUpdatingOrder] = useState<VendorOrder | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await vendorOrderService.getAll({
        page: currentPage,
        customer_name: customerName || undefined,
      });
      const data = res.data;
      setOrders(data.results ?? []);
      setNumPages(data.num_pages ?? 1);
      setTotalCount(data.count ?? 0);
    } catch {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, customerName]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset to page 1 on new search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setCustomerName(searchInput.trim());
  };

  const openStatusModal = (order: VendorOrder) => {
    setUpdatingOrder(order);
    setNewStatus(order.status);
    setStatusError("");
  };

  const closeModal = () => {
    setUpdatingOrder(null);
    setNewStatus("");
    setStatusError("");
  };

  const handleStatusUpdate = async () => {
    if (!updatingOrder) return;
    setStatusUpdating(true);
    setStatusError("");
    try {
      await vendorOrderService.updateStatus(updatingOrder.id, newStatus);
      // Optimistically update the row in state
      setOrders((prev) =>
        prev.map((o) => (o.id === updatingOrder.id ? { ...o, status: newStatus } : o))
      );
      closeModal();
    } catch {
      setStatusError("Failed to update status. Please try again.");
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <span className="text-sm text-muted-foreground">{totalCount} total</span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by customer name…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
        {customerName && (
          <button
            type="button"
            onClick={() => { setSearchInput(""); setCustomerName(""); setCurrentPage(1); }}
            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading orders…</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-destructive text-sm">{error}</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Order #</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Address</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-3">
                    <Link
                      to={`/vendor-dashboard/orders/${o.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                        ORD-{String(o.id).padStart(3, "0")}
                      </Link>
                    </td>
                  <td className="p-3 text-muted-foreground">{o.customer_fullname}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {o.customer_address ? (
                      <>
                        <p>
                          {o.customer_address.address_line}, {o.customer_address.city}, {o.customer_address.state}
                        </p>
                        {o.customer_address.phone && (
                          <p className="mt-0.5 text-foreground font-medium flex items-center gap-1">
                            📞 {o.customer_address.phone}
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="italic">No address</span>
                    )}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs ${statusColor[o.status] ?? ""}`}
                    >
                      {o.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-medium">
                    ${parseFloat(o.total_price).toFixed(2)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => openStatusModal(o)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && numPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>Page {currentPage} of {numPages}</span>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <button
              disabled={currentPage >= numPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {updatingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-2xl border border-border shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-base font-semibold mb-1">Update Order Status</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Order <span className="font-medium text-foreground">ORD-{String(updatingOrder.id).padStart(3, "0")}</span> — {updatingOrder.customer_fullname}
            </p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            {statusError && (
              <p className="text-xs text-destructive mb-3">{statusError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={statusUpdating || newStatus === updatingOrder.status}
                className="flex-1 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {statusUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
