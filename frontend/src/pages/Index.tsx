import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { VendorCard } from "@/components/VendorCard";
import { CategoryCard } from "@/components/CategoryCard";
import { Product } from "@/data/products";
import { Vendor } from "@/data/vendors";
import { Category } from "@/data/categories";
import { categoryService, productService, vendorService } from "@/services/api";
import { baseURL } from "@/lib/axios";

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
  vendor?: {
    id: number;
    store_name: string;
    slug: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    product_count: number;
  };
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
  products?: {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    image: string | null;
  }[];
  product_count: number;
}

function mapProduct(p: ApiProductPayload): Product {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    description: p.description,
    shortDescription: p.description.substring(0, 80),
    price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
    image:
      p.image ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    images: [
      p.image ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    ],
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
    ? c.image.startsWith("http")
      ? c.image
      : `${baseURL}${c.image}`
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
    logo:
      v.banner ||
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
    banner:
      v.banner ||
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    rating: 5.0,
    // productCount: v.products ? v.products.length : 0,
    product_count: v.product_count,
    joinedDate: v.created_at,
    status: v.is_approved ? "active" : "pending",
    location: v.location || "Online",
  };
}

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [featuredVendors, setFeaturedVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, featRes, newRes, vendorRes] = await Promise.all([
          categoryService.getHomepage(),
          productService.getFeatured(),
          productService.getNewArrivals(),
          vendorService.getFeatured(),
        ]);

        setCategories((catRes.data as ApiCategoryPayload[]).map(mapCategory));
        setFeaturedProducts(
          (featRes.data as ApiProductPayload[]).map(mapProduct),
        );
        setNewArrivals((newRes.data as ApiProductPayload[]).map(mapProduct));
        setFeaturedVendors(
          (vendorRes.data as ApiVendorPayload[]).map(mapVendor),
        );
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
        {/* Animated background shapes */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: "4s" }}
          />
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Text Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                  Premium Curated Vendora
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
                Discover unique finds from{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  independent creators
                </span>
              </h1>

              <p className="text-muted-foreground mt-6 text-lg md:text-xl leading-relaxed max-w-xl">
                Shop handcrafted goods, premium essentials, and one-of-a-kind
                finds from trusted vendors around the world. Elevate your
                lifestyle today.
              </p>

              <div className="flex flex-wrap gap-4 mt-10">
                <Link to="/shop">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-14 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 group"
                  >
                    Explore Collection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/vendors">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 h-14 text-base font-semibold border-border hover:bg-muted/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
                  >
                    Meet Our Makers
                  </Button>
                </Link>
              </div>

              {/* Stats/Social Proof */}
              <div className="mt-12 flex items-center gap-8 pt-8 border-t border-border/50">
                <div>
                  <div className="text-3xl font-bold text-foreground">10k+</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Unique Products
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Verified Creators
                  </div>
                </div>
                <div>
                  <div className="flex -space-x-3 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-background"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Happy Customers
                  </div>
                </div>
              </div>
            </div>

            {/* Visual/Image Side */}
            <div className="relative hidden lg:block h-full min-h-[600px]">
              {/* Main Image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl -z-10" />

              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img
                    src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop"
                    alt="Premium Furniture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />

                  {/* Floating Glass Cards */}
                  <div className="absolute bottom-8 left-8 right-8 z-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold flex items-center gap-2">
                          Handcrafted Chair{" "}
                          <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            New
                          </span>
                        </div>
                        <div className="text-white/80 text-sm">
                          By Artisanal Woodworks
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Image floating */}
                <div className="absolute -top-10 -right-10 w-48 aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-[bounce_8s_infinite]">
                  <img
                    src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400&auto=format&fit=crop"
                    alt="Perfume"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Third Image floating */}
                <div className="absolute -bottom-16 -left-12 w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-[bounce_10s_infinite_reverse]">
                  <img
                    src="https://images.unsplash.com/photo-1526406915894-7bc5ff1bc078?q=80&w=600&auto=format&fit=crop"
                    alt="Decor"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="text-white text-lg font-semibold">
                      $129.00
                    </div>
                    <div className="flex items-center text-yellow-400 text-sm">
                      ★ 5.0
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-border/40 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Free shipping over $100</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Secure payments</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                <RotateCcw className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">30-day returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">
              Browse
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mt-3">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors hidden md:flex items-center gap-2 group"
          >
            View all{" "}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading categories...
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No categories found
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/30 to-background" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">
                Curated Selection
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mt-3">
                Featured Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors hidden md:flex items-center gap-2 group"
            >
              View all{" "}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading featured products...
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No featured products yet
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary via-primary to-primary/90">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--background)/0.1),transparent_70%)]" />
          <div className="container mx-auto px-4 py-28 md:py-36 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 border border-background/20 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-background" />
              <span className="text-background/90 text-xs font-medium tracking-wide">
                For Creators
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight">
              Start selling with us
            </h2>
            <p className="mt-6 text-background/70 max-w-lg mx-auto text-lg leading-relaxed">
              Join our community of independent creators and reach thousands of
              customers worldwide.
            </p>
            <Link to="/become-vendor">
              <Button
                size="lg"
                variant="secondary"
                className="mt-10 rounded-full h-14 px-10 text-sm font-semibold shadow-premium hover:shadow-elevated transition-all duration-300 hover:scale-[1.02]"
              >
                Become a Vendor <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">
              Just Dropped
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mt-3">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors hidden md:flex items-center gap-2 group"
          >
            View all{" "}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading new arrivals...
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No new arrivals yet
          </div>
        )}
      </section>

      {/* Featured Vendors */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-muted/50 via-muted/30 to-background" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">
                Our Makers
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mt-3">
                Featured Vendors
              </h2>
            </div>
            <Link
              to="/vendors"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors hidden md:flex items-center gap-2 group"
            >
              View all{" "}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading featured vendors...
            </div>
          ) : featuredVendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6">
              {featuredVendors.map((v) => (
                <VendorCard key={v.id} vendor={v} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No featured vendors yet
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
