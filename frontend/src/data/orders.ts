export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  vendorName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: { name: string; street: string; city: string; state: string; zip: string; country: string };
  createdAt: string;
  updatedAt: string;
}

export const orders: Order[] = [
  {
    id: "1", orderNumber: "ORD-2026-001", userId: "u1",
    items: [
      { productId: "1", productName: "Minimalist Leather Watch", price: 189.00, quantity: 1, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop", vendorName: "Luxe Atelier" },
      { productId: "6", productName: "Handmade Soy Candle Set", price: 42.00, quantity: 2, image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=100&h=100&fit=crop", vendorName: "Glow & Gather" },
    ],
    total: 273.00, status: "delivered",
    shippingAddress: { name: "Sarah Miller", street: "123 Oak Avenue", city: "Portland", state: "OR", zip: "97201", country: "US" },
    createdAt: "2026-01-10", updatedAt: "2026-01-18"
  },
  {
    id: "2", orderNumber: "ORD-2026-002", userId: "u1",
    items: [
      { productId: "4", productName: "Wireless Noise-Cancelling Headphones", price: 299.00, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop", vendorName: "SoundCraft Labs" },
    ],
    total: 299.00, status: "shipped",
    shippingAddress: { name: "Sarah Miller", street: "123 Oak Avenue", city: "Portland", state: "OR", zip: "97201", country: "US" },
    createdAt: "2026-02-20", updatedAt: "2026-02-23"
  },
  {
    id: "3", orderNumber: "ORD-2026-003", userId: "u1",
    items: [
      { productId: "8", productName: "Japanese Steel Chef Knife", price: 165.00, quantity: 1, image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=100&h=100&fit=crop", vendorName: "Artisan Home Co." },
      { productId: "12", productName: "Silk Pillowcase Set", price: 79.00, quantity: 1, image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=100&h=100&fit=crop", vendorName: "Artisan Home Co." },
    ],
    total: 244.00, status: "processing",
    shippingAddress: { name: "Sarah Miller", street: "123 Oak Avenue", city: "Portland", state: "OR", zip: "97201", country: "US" },
    createdAt: "2026-03-01", updatedAt: "2026-03-02"
  },
];
