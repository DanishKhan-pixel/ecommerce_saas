import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ReviewCard } from "@/components/ReviewCard";
import { ProductCard } from "@/components/ProductCard";
import { reviews } from "@/data/reviews";
import { Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import { productService } from "@/services/api";
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
  };
  similar_products?: ApiProductPayload[];
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

export default function ProductDetails() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const response = await productService.getBySlug(slug);
        const data = response.data as ApiProductPayload;
        setProduct(mapProduct(data));
        if (data.similar_products) {
          setSimilarProducts(data.similar_products.map(mapProduct));
        } else {
          setSimilarProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Loading product...
      </div>
    );

  if (error || !product)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        {error || "Product not found"}
      </div>
    );

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="container mx-auto px-4 py-10">
      <Breadcrumbs
        items={[{ label: "Shop", to: "/shop" }, { label: product.name }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-muted/50">
          <img
            src={`${baseURL}${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col lg:py-4">
          <Link
            to={`/vendor/${product.vendorId}`}
            className="text-xs text-primary font-semibold tracking-wider uppercase hover:text-primary/80 transition-colors mb-3"
          >
            {product.vendorName}
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-2.5 mt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-3xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
            {hasDiscount && (
              <Badge className="bg-destructive/10 text-destructive border-0 text-xs font-semibold">
                Save{" "}
                {Math.round((1 - product.price / product.originalPrice!) * 100)}
                %
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground mt-6 leading-relaxed text-[15px]">
            {product.description}
          </p>

          <div className="flex items-center gap-3 mt-5">
            <Badge
              variant={product.stock > 0 ? "secondary" : "destructive"}
              className="text-xs rounded-full px-3 py-1"
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Category: {product.category}
            </span>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mt-10">
            <div className="flex items-center border border-border/60 rounded-xl bg-card">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-l-xl rounded-r-none"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-sm font-semibold">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-r-xl rounded-l-none"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="flex-1 rounded-xl h-12 text-sm font-semibold shadow-soft"
              onClick={() => addItem(product, quantity)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-border/60">
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-[12px] text-muted-foreground font-medium">
                Free Shipping
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-2">
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-[12px] text-muted-foreground font-medium">
                30-Day Returns
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-[12px] text-muted-foreground font-medium">
                Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mb-20">
        <h2 className="text-xl font-bold mb-8">
          Customer Reviews ({productReviews.length})
        </h2>
        {productReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {productReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this product.
          </p>
        )}
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Similar Products</h2>
            <Link to="/shop" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
