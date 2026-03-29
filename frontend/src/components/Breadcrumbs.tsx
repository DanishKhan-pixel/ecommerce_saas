import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
      <Link to="/" className="hover:text-foreground transition-colors"><Home className="h-3.5 w-3.5" /></Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
          {item.to ? (
            <Link to={item.to} className="hover:text-foreground transition-colors">{item.label}</Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
