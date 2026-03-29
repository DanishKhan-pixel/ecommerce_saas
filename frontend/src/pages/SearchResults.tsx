import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { productService } from "@/services/api";
import { Product } from "@/data/products";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await productService.search(query);
        // The backend might return { results: [...] } for paginated views
        setResults(response.data.results || response.data || []);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timerId);
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <div className="max-w-xl mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => { setQuery(e.target.value); setSearchParams(e.target.value ? { q: e.target.value } : {}); }}
            placeholder="Search products, vendors, categories..."
            className="pl-10 h-12 rounded-xl text-base"
            autoFocus
          />
        </div>
      </div>

      {query.trim() ? (
        isLoading ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-semibold">Searching...</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">{results.length} results for "{query}"</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {results.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p className="font-semibold">No products found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </>
        )
      ) : (
        <p className="text-muted-foreground">Start typing to search...</p>
      )}
    </div>
  );
}
