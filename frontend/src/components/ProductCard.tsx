import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { baseURL } from "@/lib/axios";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
  const discount = hasDiscount ? Math.round((1 - Number(product.price) / Number(product.originalPrice!)) * 100) : 0;


  return (
    <div className="group bg-card rounded-2xl border border-border/60 overflow-hidden hover:shadow-elevated hover:border-border transition-all duration-300">
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden aspect-[4/5]">
        <img
          src={`${baseURL}${product.image}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.isNew && (
            <Badge className="bg-foreground text-background text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full border-0">NEW</Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-destructive text-destructive-foreground text-[10px] font-semibold px-2.5 py-0.5 rounded-full border-0">-{discount}%</Badge>
          )}
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute bottom-3 left-3 text-[10px] font-medium text-foreground bg-card/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-soft">
            Only {product.stock} left
          </span>
        )}
        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            size="sm"
            className="w-full rounded-xl h-9 text-xs font-semibold shadow-elevated"
            onClick={(e) => { e.preventDefault(); addItem(product); }}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Add to Cart
          </Button>
        </div>
      </Link>
      <div className="p-4 pt-3.5">
        <p className="text-[11px] text-muted-foreground tracking-wide uppercase">{product.vendorName}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-medium text-sm text-foreground leading-snug mt-1 group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-[12px] font-medium text-foreground">{product.rating || 5}</span>
          <span className="text-[11px] text-muted-foreground">({product.reviewCount || 5})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2.5">
          <span className="text-[15px] font-bold text-foreground">${Number(product.price).toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-[12px] text-muted-foreground line-through">${Number(product.originalPrice!).toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
