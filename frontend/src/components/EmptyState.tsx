import { Package } from "lucide-react";

export function EmptyState({ title = "Nothing here yet", description = "Check back soon.", icon: Icon = Package }: {
  title?: string;
  description?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm leading-relaxed">{description}</p>
    </div>
  );
}
