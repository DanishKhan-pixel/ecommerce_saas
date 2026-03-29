import { Link } from "react-router-dom";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useCart } from "@/hooks/useCart";

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, loading } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-24 bg-muted rounded-xl"></div>
          <div className="h-24 bg-muted rounded-xl"></div>
          <div className="h-24 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2 text-[15px]">Discover amazing products from our vendors.</p>
        <Link to="/shop"><Button className="mt-8 rounded-xl h-11 px-8">Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="text-2xl font-bold mb-10">Shopping Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.product.id} className="flex gap-5 p-5 bg-card rounded-2xl border border-border/60 shadow-soft">
              <img src={item.product.image} alt={item.product.name} className="w-24 h-24 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <div>
                    <p className="text-[11px] text-muted-foreground tracking-wide uppercase">{item.product.vendorName}</p>
                    <Link to={`/product/${item.product.id}`} className="font-medium text-sm hover:text-primary transition-colors mt-0.5 block">{item.product.name}</Link>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-xl" onClick={() => removeItem(item.product.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-border/60 rounded-xl bg-background">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-l-xl rounded-r-none" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-r-xl rounded-l-none" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="font-bold text-[15px]">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border/60 p-6 h-fit lg:sticky lg:top-24 shadow-soft">
          <h3 className="font-semibold text-[15px] mb-5">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success font-medium">Free</span></div>
          </div>
          <div className="border-t border-border/60 my-5" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <Link to="/checkout">
            <Button className="w-full mt-6 rounded-xl h-12 text-sm font-semibold shadow-soft">
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="ghost" className="w-full mt-2 text-muted-foreground text-sm">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
