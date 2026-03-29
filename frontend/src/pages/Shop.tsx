import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { Product } from "@/data/products";
import { Category } from "@/data/categories";
import { Vendor } from "@/data/vendors";
import { categoryService, vendorService, productService } from "@/services/api";
import { baseURL } from "@/lib/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ApiProductPayload {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  image: string | null;
  stock: number;
  featured: boolean;
  is_available: boolean;
  created_at: string;
  vendor?: { id: number; store_name: string; slug: string };
  category?: { id: number; name: string; slug: string; image: string | null; product_count: number };
}

interface ApiCategoryPayload {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  product_count: number;
}

interface ApiVendorPayload {
  id: number;
  store_name: string;
  slug: string;
  description: string;
  banner: string | null;
  location: string | null;
  is_approved: boolean;
  featured: boolean;
  created_at: string;
  products?: { id: number; name: string; slug: string; price: string | number; image: string | null }[];
}

function mapProduct(p: ApiProductPayload): Product {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    description: p.description,
    shortDescription: p.description.substring(0, 80),
    price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
    image: p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    images: [p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    category: p.category?.name || "Uncategorized",
    categorySlug: p.category?.slug || "uncategorized",
    vendorId: p.vendor ? String(p.vendor.id) : "",
    vendorName: p.vendor?.store_name || "Unknown Vendor",
    stock: p.stock,
    rating: 5.0,
    reviewCount: 0,
    featured: p.featured,
    isNew: false,
    tags: [],
    createdAt: p.created_at,
  } as unknown as Product;
}

function mapCategory(c: ApiCategoryPayload): Category {
  const img = c.image
    ? (c.image.startsWith("http") ? c.image : `${baseURL}${c.image}`)
    : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop";
  return {
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: img,
    productCount: c.product_count,
  };
}

function mapVendor(v: ApiVendorPayload): Vendor {
  return {
    id: String(v.id),
    name: v.store_name,
    slug: v.slug,
    description: v.description,
    logo: v.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
    banner: v.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    rating: 5.0,
    product_count: v.products ? v.products.length : 0,
    joinedDate: v.created_at,
    status: v.is_approved ? "active" : "pending",
    location: v.location || "Online",
  };
}

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // When filters change, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedVendor, priceRange, sortBy]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Convert the sort option into backend ordering formats if possible
        // Note: Backend supports: 'price', '-price', 'newest' (which is the default)
        let backendOrdering = "newest";
        if (sortBy === "price-low") backendOrdering = "price";
        if (sortBy === "price-high") backendOrdering = "-price";
        // fallback 'featured' and 'rating' might not be explicitly supported by backend `ordering` kwarg, 
        // but it will default to newest cleanly

        const [prodRes, catRes, vendorRes] = await Promise.all([
          productService.getAll({
            page: currentPage,
            category: selectedCategory || undefined,
            vendor: selectedVendor || undefined,
            min_price: priceRange[0],
            max_price: priceRange[1],
            ordering: backendOrdering,
          }),
          categoryService.getAll(),
          vendorService.getAll(),
        ]);
        const prodData = prodRes.data as {
          count: number;
          total_pages: number;
          current_page: number;
          results: ApiProductPayload[];
        };
        setProducts(prodData.results.map(mapProduct));
        setTotalPages(prodData.total_pages);
        setTotalCount(prodData.count);
        setCategories((catRes.data as ApiCategoryPayload[]).map(mapCategory));
        setVendors((vendorRes.data as ApiVendorPayload[]).map(mapVendor));
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, selectedCategory, selectedVendor, priceRange, sortBy]);

  const clearFilters = () => { setSelectedCategory(""); setSelectedVendor(""); setPriceRange([0, 1000]); };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const FilterPanel = () => (
    <div className="space-y-7">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Category</h4>
        <div className="space-y-2.5">
          {categories.map(c => (
            <label key={c.slug} className="flex items-center gap-2.5 cursor-pointer text-sm group">
              <Checkbox checked={selectedCategory === c.slug} onCheckedChange={() => setSelectedCategory(selectedCategory === c.slug ? "" : c.slug)} />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">{c.name}</span>
              <span className="ml-auto text-[11px] text-muted-foreground/60">{c.productCount}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Vendor</h4>
        <div className="space-y-2.5">
          {vendors.map(v => (
            <label key={v.id} className="flex items-center gap-2.5 cursor-pointer text-sm group">
              <Checkbox checked={selectedVendor === v.id} onCheckedChange={() => setSelectedVendor(selectedVendor === v.id ? "" : v.id)} />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">{v.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Price Range</h4>
        <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={1000} step={5} className="mb-3" />
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground text-xs">
        <X className="h-3 w-3 mr-1" /> Clear Filters
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Loading shop...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: "Shop" }]} />
      <div className="flex items-start justify-between mb-8">
        <PageHeader title="Shop" description={`${totalCount} products available`} />
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="md:hidden rounded-xl" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4 mr-1.5" /> Filters
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44 h-10 text-sm rounded-xl border-border/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-10">
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0 md:sticky md:top-[88px] md:self-start md:max-h-[calc(100vh-96px)] md:overflow-y-auto md:pr-2`}>
          <FilterPanel />
        </aside>
        <div className="flex-1">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {products.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              <p className="font-semibold text-foreground">No products found</p>
              <p className="text-sm mt-1.5">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((page, idx) =>
                typeof page === "string" ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-sm text-muted-foreground select-none">
                    …
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9 rounded-lg text-sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
