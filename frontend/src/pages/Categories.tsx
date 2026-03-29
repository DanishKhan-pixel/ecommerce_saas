import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { categoryService } from "@/services/api";
import { Category } from "@/data/categories";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        // Default productCount to 0 since CategorySerializer doesn't include it
        const data = response.data.map((cat: { product_count?: number } & Category) => ({
          ...cat,
          productCount: cat.product_count || 0,
        }));
        setCategories(data);
      } catch (err: unknown) {
        setError("Failed to load categories. Please try again later.");
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Categories" }]} />
      <PageHeader title="All Categories" description="Browse products by category" />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">{error}</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No categories found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      )}
    </div>
  );
}
