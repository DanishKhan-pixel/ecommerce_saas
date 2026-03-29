import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";
import { cartService } from "@/services/api";
import { baseURL } from "@/lib/axios";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to map backend product to frontend Product interface
const mapProduct = (p: any): Product => ({
  id: String(p.id),
  name: p.name,
  slug: p.slug,
  description: p.description,
  shortDescription: p.description?.substring(0, 80) || "",
  price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
  image: p.image?.startsWith('http') ? p.image : `${baseURL}${p.image || ''}`,
  images: [p.image?.startsWith('http') ? p.image : `${baseURL}${p.image || ''}`],
  category: p.category?.name || "Uncategorized",
  categorySlug: p.category?.slug || "uncategorized",
  vendorId: p.vendor ? String(p.vendor.id) : "",
  vendorName: p.vendor?.store_name || "Unknown Vendor",
  stock: p.stock,
  rating: 5,
  reviewCount: 0,
  featured: p.featured,
  isNew: false,
  tags: [],
  createdAt: p.created_at,
} as unknown as Product);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await cartService.getCart();
      const data = res.data;
      
      // Store session ID if provided by the backend cart endpoint
      if (data.session_id) {
        localStorage.setItem("session_id", data.session_id);
      }

      setItems(data.items.map((item: any) => ({
        id: item.id,
        product: mapProduct(item.product),
        quantity: item.quantity,
        subtotal: item.subtotal
      })));
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (product: Product, quantity = 1) => {
    try {
      const res = await cartService.addToCart(product.id, quantity);
      if (res.data.session_id) localStorage.setItem("session_id", res.data.session_id);
      await fetchCart(false);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const removeItem = async (productId: string) => {
    const item = items.find(i => String(i.product.id) === String(productId));
    if (!item) return;
    try {
      await cartService.removeCartItem(item.id);
      await fetchCart(false);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId);
    const item = items.find(i => String(i.product.id) === String(productId));
    if (!item) return;
    try {
      await cartService.updateCartItem(item.id, quantity);
      await fetchCart(false);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await fetchCart(false);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
