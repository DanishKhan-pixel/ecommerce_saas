import { Star } from "lucide-react";
import { Review } from "@/data/reviews";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-card rounded-2xl border border-border/60 p-6">
      <div className="flex items-center gap-3 mb-3.5">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
          {review.userName.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{review.userName}</p>
          <p className="text-[11px] text-muted-foreground">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-primary text-primary' : 'text-border'}`} />
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
    </div>
  );
}
