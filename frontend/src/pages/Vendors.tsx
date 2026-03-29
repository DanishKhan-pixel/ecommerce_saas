import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { VendorCard } from "@/components/VendorCard";
import { apiClient } from "@/lib/axios";
import { Vendor } from "@/data/vendors";

// Adjusting type to work with the expected payload
interface ApiVendorPayload {
  id: string;
  store_name: string;
  slug: string;
  description: string;
  banner: string | null;
  products?: unknown[];
  created_at: string;
  is_approved: boolean;
  location: string | null;
}

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await apiClient.get('/api/vendors/');
        const data = response.data.map((v: ApiVendorPayload) => ({
          id: v.id,
          name: v.store_name,
          slug: v.slug,
          description: v.description,
          logo: v.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop", // placeholder logo
          banner: v.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
          rating: 5.0, // Fixed rating or fetch from reviews later
          productCount: v.products ? v.products.length : 0,
          joinedDate: v.created_at,
          status: v.is_approved ? 'active' : 'pending',
          location: v.location || "Online"
        }));
        setVendors(data);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Vendors" }]} />
      <PageHeader title="Our Vendors" description="Discover independent creators and premium brands" />
      
      {loading ? (
        <div className="text-center py-10">Loading vendors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {vendors.map(v => <VendorCard key={v.id} vendor={v} />)}
          {vendors.length === 0 && <div className="col-span-full text-center text-muted-foreground py-10">No vendors found.</div>}
        </div>
      )}
    </div>
  );
}
