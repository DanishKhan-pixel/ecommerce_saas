import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, Ban, ChevronLeft, ChevronRight, Loader2, Star, Search } from "lucide-react";
import { adminVendorService } from "@/services/api";
import { baseURL } from "@/lib/axios";

interface VendorUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface Vendor {
  id: number;
  user: VendorUser;
  store_name: string;
  slug: string;
  description: string;
  banner: string | null;
  location: string;
  is_approved: boolean;
  featured: boolean;
  product_count: number;
  created_at: string;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Vendor[];
}

export default function ManageVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchVendors = useCallback(async (p: number, s: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminVendorService.getAll({ page: p, search: s });
      const data: PaginatedResponse = res.data;
      setVendors(data.results);
      setTotalCount(data.count);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch {
      setError("Failed to load vendors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchVendors(page, search);
    }, 500);
    return () => clearTimeout(delay);
  }, [page, search, fetchVendors]);

  const handleAction = async (
    vendorId: number,
    action: "approve" | "reject" | "suspend"
  ) => {
    setActionLoading(vendorId);
    setActionError(null);
    try {
      await adminVendorService[action](vendorId);
      // Refresh current page after action
      await fetchVendors(page, search);
    } catch {
      setActionError("Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    setTogglingId(id);
    try {
      const res = await adminVendorService.toggleFeatured(id);
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, featured: res.data.featured } : v))
      );
    } catch {
      // silently ignore; state stays as-is
    } finally {
      setTogglingId(null);
    }
  };

  const statusBadge = (vendor: Vendor) => {
    if (vendor.is_approved) return <Badge className="capitalize text-xs bg-green-500/10 text-green-600 border-green-500/20">Approved</Badge>;
    return <Badge variant="outline" className="capitalize text-xs text-yellow-600 border-yellow-500/20">Pending</Badge>;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Manage Vendors</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vendors..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {actionError && (
        <div className="mb-4 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
          {actionError}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading vendors…</span>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-destructive">{error}</div>
        ) : vendors.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No vendors found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Vendor</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Products</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Location</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Featured</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <Link
                      to={`/admin/vendors/${v.id}`}
                      className="flex items-center gap-3"
                    >
                      {v.banner ? (
                        <img
                          src={`${baseURL}${v.banner}`}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {v.store_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium hover:text-primary">
                        {v.store_name}
                      </span>
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {v.product_count}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {v.location || "—"}
                  </td>
                  <td className="p-3">{statusBadge(v)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleFeatured(v.id)}
                      disabled={togglingId === v.id}
                      title={v.featured ? "Remove from featured" : "Mark as featured"}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        v.featured
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <Star className={`h-3 w-3 ${v.featured ? "fill-current" : ""}`} />
                      <span>{togglingId === v.id ? "…" : v.featured ? "Featured" : "Set Featured"}</span>
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {actionLoading === v.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-500/10"
                            title="Approve"
                            onClick={() => handleAction(v.id, "approve")}
                            disabled={v.is_approved}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            title="Reject"
                            onClick={() => handleAction(v.id, "reject")}
                            disabled={!v.is_approved}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-500/10"
                            title="Suspend"
                            onClick={() => handleAction(v.id, "suspend")}
                            disabled={!v.is_approved}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages} &middot; {totalCount} vendor{totalCount !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={!hasPrev}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
