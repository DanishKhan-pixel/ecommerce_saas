export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  vendorId: string;
  vendorName: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  isNew: boolean;
  tags: string[];
  createdAt: string;
}

export const products: Product[] = [
  {
    id: "1", name: "Minimalist Leather Watch", slug: "minimalist-leather-watch",
    price: 189.00, originalPrice: 249.00,
    description: "A beautifully crafted minimalist watch featuring genuine Italian leather strap and sapphire crystal glass. Water-resistant up to 50m with a Japanese quartz movement for precise timekeeping.",
    shortDescription: "Genuine Italian leather strap with sapphire crystal",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"],
    category: "Accessories", categorySlug: "accessories", vendorId: "1", vendorName: "Luxe Atelier",
    stock: 24, rating: 4.8, reviewCount: 142, featured: true, isNew: false,
    tags: ["watch", "leather", "minimalist"], createdAt: "2025-12-01"
  },
  {
    id: "2", name: "Organic Cotton Tee", slug: "organic-cotton-tee",
    price: 49.00,
    description: "Premium organic cotton t-shirt with a relaxed fit. Sustainably sourced and ethically manufactured. Pre-shrunk fabric for lasting comfort.",
    shortDescription: "Sustainably sourced premium organic cotton",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"],
    category: "Clothing", categorySlug: "clothing", vendorId: "2", vendorName: "EcoWear Studio",
    stock: 150, rating: 4.6, reviewCount: 89, featured: true, isNew: true,
    tags: ["cotton", "organic", "sustainable"], createdAt: "2026-01-15"
  },
  {
    id: "3", name: "Ceramic Pour-Over Set", slug: "ceramic-pour-over-set",
    price: 78.00,
    description: "Handcrafted ceramic pour-over coffee set. Includes dripper, carafe, and two cups. Each piece is individually glazed for a unique finish.",
    shortDescription: "Handcrafted ceramic with unique glaze finish",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop"],
    category: "Home & Kitchen", categorySlug: "home-kitchen", vendorId: "3", vendorName: "Artisan Home Co.",
    stock: 35, rating: 4.9, reviewCount: 67, featured: true, isNew: false,
    tags: ["ceramic", "coffee", "handcrafted"], createdAt: "2025-11-20"
  },
  {
    id: "4", name: "Wireless Noise-Cancelling Headphones", slug: "wireless-noise-cancelling-headphones",
    price: 299.00, originalPrice: 349.00,
    description: "Premium wireless headphones with active noise cancellation. 30-hour battery life, plush memory foam ear cups, and studio-quality sound.",
    shortDescription: "Active noise cancellation, 30-hour battery",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"],
    category: "Electronics", categorySlug: "electronics", vendorId: "4", vendorName: "SoundCraft Labs",
    stock: 60, rating: 4.7, reviewCount: 234, featured: true, isNew: false,
    tags: ["headphones", "wireless", "noise-cancelling"], createdAt: "2025-10-05"
  },
  {
    id: "5", name: "Linen Blend Throw Blanket", slug: "linen-blend-throw-blanket",
    price: 120.00,
    description: "Luxurious linen-cotton blend throw blanket. Lightweight yet warm, perfect for any season. Available in muted natural tones.",
    shortDescription: "Lightweight linen-cotton blend for all seasons",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop"],
    category: "Home & Kitchen", categorySlug: "home-kitchen", vendorId: "3", vendorName: "Artisan Home Co.",
    stock: 45, rating: 4.5, reviewCount: 56, featured: false, isNew: true,
    tags: ["linen", "blanket", "home"], createdAt: "2026-02-01"
  },
  {
    id: "6", name: "Handmade Soy Candle Set", slug: "handmade-soy-candle-set",
    price: 42.00,
    description: "Set of three handmade soy candles in calming scents: lavender, eucalyptus, and vanilla. 40-hour burn time each. Clean-burning and eco-friendly.",
    shortDescription: "Three calming scents, 40-hour burn time",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop"],
    category: "Home & Kitchen", categorySlug: "home-kitchen", vendorId: "5", vendorName: "Glow & Gather",
    stock: 80, rating: 4.8, reviewCount: 198, featured: false, isNew: false,
    tags: ["candle", "soy", "handmade"], createdAt: "2025-09-15"
  },
  {
    id: "7", name: "Merino Wool Beanie", slug: "merino-wool-beanie",
    price: 38.00,
    description: "Ultra-soft merino wool beanie. Breathable and temperature-regulating. Unisex design with a clean, modern silhouette.",
    shortDescription: "Ultra-soft merino wool, unisex fit",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=600&fit=crop"],
    category: "Accessories", categorySlug: "accessories", vendorId: "2", vendorName: "EcoWear Studio",
    stock: 200, rating: 4.4, reviewCount: 73, featured: false, isNew: true,
    tags: ["beanie", "wool", "merino"], createdAt: "2026-01-28"
  },
  {
    id: "8", name: "Japanese Steel Chef Knife", slug: "japanese-steel-chef-knife",
    price: 165.00,
    description: "8-inch chef knife forged from VG-10 Japanese steel. Razor-sharp edge with a beautiful Damascus pattern. Ergonomic pakkawood handle.",
    shortDescription: "VG-10 Japanese steel with Damascus pattern",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop"],
    category: "Home & Kitchen", categorySlug: "home-kitchen", vendorId: "3", vendorName: "Artisan Home Co.",
    stock: 18, rating: 4.9, reviewCount: 312, featured: true, isNew: false,
    tags: ["knife", "japanese", "kitchen"], createdAt: "2025-08-10"
  },
  {
    id: "9", name: "Plant-Based Skincare Kit", slug: "plant-based-skincare-kit",
    price: 89.00,
    description: "Complete daily skincare routine with cleanser, toner, moisturizer, and serum. All plant-based, cruelty-free, and packed with natural antioxidants.",
    shortDescription: "Complete daily routine, plant-based ingredients",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop"],
    category: "Beauty", categorySlug: "beauty", vendorId: "5", vendorName: "Glow & Gather",
    stock: 55, rating: 4.6, reviewCount: 167, featured: false, isNew: false,
    tags: ["skincare", "plant-based", "natural"], createdAt: "2025-11-01"
  },
  {
    id: "10", name: "Canvas Weekender Bag", slug: "canvas-weekender-bag",
    price: 135.00, originalPrice: 165.00,
    description: "Durable waxed canvas weekender bag with leather trim. Spacious main compartment with interior pockets. Perfect for short trips.",
    shortDescription: "Waxed canvas with genuine leather trim",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"],
    category: "Accessories", categorySlug: "accessories", vendorId: "1", vendorName: "Luxe Atelier",
    stock: 30, rating: 4.7, reviewCount: 94, featured: false, isNew: false,
    tags: ["bag", "canvas", "travel"], createdAt: "2025-10-20"
  },
  {
    id: "11", name: "Smart Water Bottle", slug: "smart-water-bottle",
    price: 55.00,
    description: "Insulated smart water bottle that tracks your hydration. LED temperature display, keeps drinks cold for 24h or hot for 12h.",
    shortDescription: "Hydration tracking with LED temperature display",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop"],
    category: "Electronics", categorySlug: "electronics", vendorId: "4", vendorName: "SoundCraft Labs",
    stock: 90, rating: 4.3, reviewCount: 45, featured: false, isNew: true,
    tags: ["bottle", "smart", "hydration"], createdAt: "2026-02-10"
  },
  {
    id: "12", name: "Silk Pillowcase Set", slug: "silk-pillowcase-set",
    price: 79.00,
    description: "Set of two mulberry silk pillowcases. 22-momme weight for ultimate luxury. Reduces friction for healthier hair and skin.",
    shortDescription: "22-momme mulberry silk, set of two",
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&h=600&fit=crop"],
    category: "Home & Kitchen", categorySlug: "home-kitchen", vendorId: "3", vendorName: "Artisan Home Co.",
    stock: 40, rating: 4.8, reviewCount: 128, featured: false, isNew: false,
    tags: ["silk", "pillowcase", "luxury"], createdAt: "2025-12-15"
  },
  {
    id: "13", name: "Bamboo Sunglasses", slug: "bamboo-sunglasses",
    price: 68.00,
    description: "Eco-friendly sunglasses with bamboo frames and polarized lenses. UV400 protection. Lightweight and comfortable for all-day wear.",
    shortDescription: "Bamboo frames with polarized UV400 lenses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop"],
    category: "Accessories", categorySlug: "accessories", vendorId: "2", vendorName: "EcoWear Studio",
    stock: 110, rating: 4.5, reviewCount: 86, featured: false, isNew: false,
    tags: ["sunglasses", "bamboo", "eco"], createdAt: "2025-11-10"
  },
  {
    id: "14", name: "Portable Bluetooth Speaker", slug: "portable-bluetooth-speaker",
    price: 129.00,
    description: "Compact waterproof Bluetooth speaker with 360° sound. 20-hour battery, IPX7 waterproof rating. Pairs seamlessly with any device.",
    shortDescription: "360° sound, waterproof, 20-hour battery",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop"],
    category: "Electronics", categorySlug: "electronics", vendorId: "4", vendorName: "SoundCraft Labs",
    stock: 75, rating: 4.6, reviewCount: 189, featured: true, isNew: false,
    tags: ["speaker", "bluetooth", "waterproof"], createdAt: "2025-09-25"
  },
  {
    id: "15", name: "Rose Gold Jewelry Set", slug: "rose-gold-jewelry-set",
    price: 225.00, originalPrice: 280.00,
    description: "Elegant rose gold jewelry set including necklace, bracelet, and earrings. Hypoallergenic stainless steel with rose gold plating.",
    shortDescription: "Necklace, bracelet & earrings in rose gold",
    image: "https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=600&h=600&fit=crop"],
    category: "Accessories", categorySlug: "accessories", vendorId: "1", vendorName: "Luxe Atelier",
    stock: 22, rating: 4.7, reviewCount: 156, featured: true, isNew: false,
    tags: ["jewelry", "rose-gold", "set"], createdAt: "2025-10-15"
  },
  {
    id: "16", name: "Yoga Mat Premium", slug: "yoga-mat-premium",
    price: 95.00,
    description: "Extra thick non-slip yoga mat with alignment lines. Made from natural tree rubber. Includes carrying strap.",
    shortDescription: "Natural rubber with alignment guides",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop"],
    category: "Sports", categorySlug: "sports", vendorId: "2", vendorName: "EcoWear Studio",
    stock: 65, rating: 4.4, reviewCount: 72, featured: false, isNew: true,
    tags: ["yoga", "mat", "fitness"], createdAt: "2026-02-20"
  },
];
