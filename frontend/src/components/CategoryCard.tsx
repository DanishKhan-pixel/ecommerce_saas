import { Link } from "react-router-dom";
import { Category } from "@/data/categories";
import { baseURL } from "@/lib/axios";

export function CategoryCard({ category }: { category: Category }) {

  console.log("category.image", category.image);

  return (
    <Link to={`/shop?category=${category.slug}`} className="group relative block rounded-2xl overflow-hidden aspect-[4/3] hover:shadow-elevated transition-all duration-300">
      <img src={category.image?.startsWith('http') ? category.image : `${baseURL}${category.image}`} alt={category.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-semibold text-background text-sm tracking-wide">{category.name}</h3>
        <p className="text-background/60 text-[12px] mt-0.5">{category.product_count} products</p>
      </div>
    </Link>
  );
}

// {category.image}