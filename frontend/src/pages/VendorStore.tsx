import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { vendors as defaultVendors, Vendor } from "@/data/vendors";
import { Product } from "@/data/products";
import { apiClient, baseURL } from "@/lib/axios";

interface ApiProductPayload {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price: string | number;
  image: string | null;
  category?: string;
  stock?: number;
  created_at?: string;
}

interface ApiVendorPayload {
  id: string;
  store_name: string;
  slug: string;
  description: string;
  banner: string | null;
  products?: ApiProductPayload[];
  created_at: string;
  is_approved: boolean;
  location: string | null;
}

export default function VendorStore() {
  const { id } = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await apiClient.get(`/api/vendors/${id}/`);
        const v: ApiVendorPayload = response.data;
        
        const vendorData: Vendor = {
          id: v.id,
          name: v.store_name,
          slug: v.slug,
          description: v.description,
          logo: v.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
          banner: v.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
          rating: 5.0,
          productCount: v.products ? v.products.length : 0,
          joinedDate: v.created_at,
          status: v.is_approved ? 'active' : 'pending',
          location: v.location || "Online"
        };
        setVendor(vendorData);

        const productsData: Product[] = (v.products || []).map((p: ApiProductPayload) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description || "",
          shortDescription: (p.description || "").substring(0, 50),
          price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
          image: p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
          images: [p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
          category: p.category || "Uncategorized",
          categorySlug: p.category ? p.category.toLowerCase().replace(/\s+/g, '-') : "uncategorized",
          vendorId: v.id,
          vendorName: v.store_name,
          rating: 5.0,
          reviewCount: 0,
          stock: p.stock || 0,
          featured: false,
          isNew: true,
          tags: [],
          createdAt: p.created_at || new Date().toISOString()
        } as unknown as Product));
        
        setVendorProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch vendor:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchVendorDetails();
    }
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center">Loading vendor store...</div>;
  if (!vendor) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Vendor not found</div>;

  return (
    <div>
      {/* Banner */}
      <div className="h-48 md:h-64 relative overflow-hidden">
        <img src={`${baseURL}${vendor.banner}`} alt={vendor.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      <div className="container mx-auto px-4">
        <div className="-mt-10 mb-8 relative z-10 flex items-end gap-4">
          <div className="w-20 h-20 rounded-2xl border-4 border-background overflow-hidden bg-card shadow-lg">
            <img src={`${baseURL}${vendor.logo}`} alt={vendor.name} className="w-full h-full object-cover" />
          </div>
          <div className="pb-1 max-w-full">
            <h1 className="text-2xl md:text-3xl font-bold bg-background/80 backdrop-blur-sm px-4 py-1.5 rounded-xl shadow-sm border border-border/50 inline-block w-fit max-w-full truncate">
              {vendor.name}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> {vendor.rating}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {vendor.location}</span>
              <span>{vendorProducts.length} products</span>
            </div>
          </div>
        </div>

        <Breadcrumbs items={[{ label: "Vendors", to: "/vendors" }, { label: vendor.name }]} />

        <p className="text-muted-foreground mb-8 max-w-2xl">{vendor.description}</p>

        <h2 className="text-xl font-bold mb-6">Products by {vendor.name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-16">
          {vendorProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
