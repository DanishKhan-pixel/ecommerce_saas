import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Vendor } from "@/data/vendors";
import { baseURL } from "@/lib/axios";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link to={`/vendor/${vendor.id}`} className="group block bg-card rounded-2xl border border-border/60 overflow-hidden hover:shadow-elevated hover:border-border transition-all duration-300">
      <div className="h-28 overflow-hidden">
        <img src={`${baseURL}${vendor.banner}`} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
      </div>
      <div className="p-4 -mt-7 relative">
        <div className="w-12 h-12 rounded-xl border-[3px] border-card overflow-hidden bg-card shadow-soft">
          <img src={`${baseURL}${vendor.logo}`} alt={vendor.name} className="w-full h-full object-cover" />
        </div>
        <h3 className="font-semibold text-sm mt-2.5 group-hover:text-primary transition-colors duration-200">{vendor.name}</h3>
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {vendor.rating}</span>
          <span>{vendor.product_count} products</span>
        </div>
        <p className="text-[12px] text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{vendor.description}</p>
        <div className="flex items-center gap-1 mt-2.5 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3" /> {vendor.location}
        </div>
      </div>
    </Link>
  );
}
