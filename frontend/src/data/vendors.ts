export interface Vendor {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  banner: string;
  rating: number;
  product_count: number;
  joinedDate: string;
  status: 'active' | 'pending' | 'suspended';
  location: string;
}

export const vendors: Vendor[] = [
  {
    id: "1", name: "Luxe Atelier", slug: "luxe-atelier",
    description: "Curating timeless accessories crafted from the finest materials. We believe in quality over quantity, creating pieces that last a lifetime.",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    rating: 4.8, product_count: 3, joinedDate: "2024-06-15", status: "active", location: "Milan, Italy"
  },
  {
    id: "2", name: "EcoWear Studio", slug: "ecowear-studio",
    description: "Sustainable fashion for the conscious consumer. Every piece is ethically made using organic and recycled materials, proving style and sustainability can coexist.",
    logo: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&h=400&fit=crop",
    rating: 4.5, product_count: 4, joinedDate: "2024-08-20", status: "active", location: "Portland, OR"
  },
  {
    id: "3", name: "Artisan Home Co.", slug: "artisan-home-co",
    description: "Handcrafted home goods that bring warmth and character to any space. Each piece tells a story of traditional craftsmanship meeting modern design.",
    logo: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&h=400&fit=crop",
    rating: 4.9, product_count: 5, joinedDate: "2024-05-01", status: "active", location: "Brooklyn, NY"
  },
  {
    id: "4", name: "SoundCraft Labs", slug: "soundcraft-labs",
    description: "Audio innovation meets sleek design. We engineer premium sound experiences with cutting-edge technology, designed for the modern lifestyle.",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=400&fit=crop",
    rating: 4.7, product_count: 3, joinedDate: "2024-07-10", status: "active", location: "San Francisco, CA"
  },
  {
    id: "5", name: "Glow & Gather", slug: "glow-and-gather",
    description: "Natural beauty and home fragrance crafted with intention. Plant-based formulas, clean ingredients, and sustainable packaging for mindful living.",
    logo: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&h=400&fit=crop",
    rating: 4.6, product_count: 2, joinedDate: "2024-09-05", status: "active", location: "Austin, TX"
  },
];
