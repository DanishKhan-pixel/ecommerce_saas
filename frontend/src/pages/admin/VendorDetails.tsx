import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Loader2, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  created_at: string;
}

export default function AdminVendorDetails() {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminVendorService.getById(id);
        setVendor(res.data);
      } catch {
        setError("Vendor not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading vendor…</span>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="py-20 text-center text-destructive">
        {error ?? "Vendor not found."}
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/admin/vendors"
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Vendors
      </Link>

      <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-32 overflow-hidden bg-muted">
          {vendor.banner ? (
            <img
              src={`${baseURL}${vendor.banner}`}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Store className="h-10 w-10 opacity-30" />
            </div>
          )}
        </div>

        {/* Store info */}
        <div className="p-6 -mt-6 relative">
          <div className="w-14 h-14 rounded-xl border-4 border-card bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground overflow-hidden">
            {vendor.banner ? (
              <img
                src={`${baseURL}${vendor.banner}`}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              vendor.store_name.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex items-start justify-between mt-2">
            <div>
              <h1 className="text-xl font-bold">{vendor.store_name}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                {vendor.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {vendor.location}
                  </span>
                )}
              </div>
            </div>
            <Badge
              className={
                vendor.is_approved
                  ? "text-xs bg-green-500/10 text-green-600 border-green-500/20"
                  : "text-xs text-yellow-600 border-yellow-500/20"
              }
              variant="outline"
            >
              {vendor.is_approved ? "Approved" : "Pending"}
            </Badge>
          </div>

          {vendor.description && (
            <p className="text-muted-foreground mt-3 text-sm">
              {vendor.description}
            </p>
          )}
        </div>
      </div>

      {/* Owner details */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-3">Owner Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Name</span>
            <p className="font-medium mt-0.5">
              {vendor.user.first_name} {vendor.user.last_name}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Email</span>
            <p className="font-medium mt-0.5">{vendor.user.email}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Store Slug</span>
            <p className="font-medium mt-0.5 font-mono text-xs">{vendor.slug}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Joined</span>
            <p className="font-medium mt-0.5">
              {new Date(vendor.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
