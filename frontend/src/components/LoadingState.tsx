import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ count = 6, variant = "grid" }: { count?: number; variant?: "grid" | "list" }) {
  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-5 p-5 rounded-2xl border border-border/60">
            <Skeleton className="w-16 h-16 rounded-xl" />
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/60 overflow-hidden">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="p-4 space-y-2.5">
            <Skeleton className="h-3 w-1/3 rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
