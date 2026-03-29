import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Edit, Loader2, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { vendorService } from "@/services/api";
import { baseURL } from "@/lib/axios";

interface Vendor {
  id: number;
  store_name: string;
  slug: string;
  description: string;
  banner: string | null;
  location: string;
  is_approved: boolean;
  created_at: string;
}

export default function VendorMyStore() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await vendorService.myStore();
        setVendor(response.data);
      } catch {
        setError("Could not load your store. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStore();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-muted-foreground">{error || "No store found."}</p>
        <Link to="/become-vendor">
          <Button variant="outline" className="rounded-xl">Create a Store</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Store</h1>
        <Link to="/vendor-dashboard/store/edit">
          <Button variant="outline" size="sm" className="rounded-xl">
            <Edit className="h-4 w-4 mr-1" /> Edit Store
          </Button>
        </Link>
      </div>

      {/* Approval Status Banner */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mb-6 ${
        vendor.is_approved
          ? "bg-green-500/10 text-green-600"
          : "bg-amber-500/10 text-amber-600"
      }`}>
        {vendor.is_approved
          ? <><CheckCircle className="h-4 w-4" /> Your store is approved and live.</>
          : <><Clock className="h-4 w-4" /> Your store application is pending admin approval.</>
        }
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Banner */}
        <div className="h-40 bg-muted overflow-hidden">
          {vendor.banner ? (
            <img src={`${baseURL}${vendor.banner}`} alt="Store banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No banner uploaded
            </div>
          )}
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold">{vendor.store_name}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            {vendor.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {vendor.location}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-4 max-w-xl">{vendor.description}</p>
        </div>
      </div>
    </div>
  );
}
