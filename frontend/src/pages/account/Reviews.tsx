import { reviews } from "@/data/reviews";
import { ReviewCard } from "@/components/ReviewCard";

export default function MyReviews() {
  const myReviews = reviews.filter(r => r.userId === "u1");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myReviews.map(r => <ReviewCard key={r.id} review={r} />)}
      </div>
    </div>
  );
}
