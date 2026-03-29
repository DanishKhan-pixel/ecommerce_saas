export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviews: Review[] = [
  { id: "1", productId: "1", userId: "u1", userName: "Sarah M.", rating: 5, comment: "Absolutely stunning watch. The leather is incredibly soft and the craftsmanship is impeccable. Worth every penny.", createdAt: "2026-01-20" },
  { id: "2", productId: "1", userId: "u2", userName: "James K.", rating: 4, comment: "Great quality and looks exactly like the photos. Wish it came in more strap colors.", createdAt: "2026-01-15" },
  { id: "3", productId: "1", userId: "u3", userName: "Emily R.", rating: 5, comment: "Bought this as a gift and my partner loves it. Beautiful packaging too!", createdAt: "2026-01-10" },
  { id: "4", productId: "3", userId: "u1", userName: "Sarah M.", rating: 5, comment: "The glaze on each piece is unique and gorgeous. Makes my morning coffee ritual feel special.", createdAt: "2026-02-05" },
  { id: "5", productId: "4", userId: "u4", userName: "Alex T.", rating: 5, comment: "Best noise cancellation I've experienced. Perfect for working from home.", createdAt: "2025-12-20" },
  { id: "6", productId: "4", userId: "u5", userName: "Maria L.", rating: 4, comment: "Sound quality is outstanding. Slightly heavy for long sessions but otherwise perfect.", createdAt: "2025-12-15" },
  { id: "7", productId: "8", userId: "u2", userName: "James K.", rating: 5, comment: "This knife is a game changer. Incredibly sharp and the Damascus pattern is beautiful.", createdAt: "2026-01-25" },
  { id: "8", productId: "6", userId: "u3", userName: "Emily R.", rating: 5, comment: "These candles smell amazing and burn so cleanly. Already ordered a second set.", createdAt: "2025-12-01" },
];
