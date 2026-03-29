import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { adminProductService, vendorProductService } from "@/services/api";
import { baseURL } from "@/lib/axios";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  image: string | null;
  price: string;
  stock: number;
  featured: boolean;
  category: { id: number; name: string } | null;
  vendor: { id: number; store_name: string } | null;
}

interface ProductsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: number | null;
  previous: number | null;
  results: Product[];
}

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [storeName, setStoreName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchProducts = useCallback(async (page: number, search: string, category: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await adminProductService.getAll({
        page,
        store_name: search || undefined,
        category: category || undefined,
      });
      const data: ProductsResponse = res.data;
      setProducts(data.results);
      setTotalPages(data.total_pages);
      setCurrentPage(data.current_page);
      setCount(data.count);
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories once on mount
  useEffect(() => {
    vendorProductService.getCategories().then((res) => {
      setCategories(res.data);
    });
  }, []);

  // Fetch products when page, storeName, or selectedCategory changes
  useEffect(() => {
    fetchProducts(currentPage, storeName, selectedCategory);
  }, [currentPage, storeName, selectedCategory, fetchProducts]);

  // Debounce store name search
  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreName(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleFeatured = async (id: number) => {
    setTogglingId(id);
    try {
      const res = await adminProductService.toggleFeatured(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: res.data.featured } : p))
      );
    } catch {
      // silently ignore; state stays as-is
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by store name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-52"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {count > 0 && (
          <span className="text-sm text-muted-foreground self-center ml-auto">
            {count} product{count !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Loading products…
          </div>
        ) : error ? (
          <div className="p-8 text-center text-destructive text-sm">{error}</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No products found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Vendor</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Price</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Stock</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Featured</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img
                          src={`${baseURL}${p.image}`}
                          alt={p.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                          —
                        </div>
                      )}
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {p.vendor?.store_name ?? "—"}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {p.category?.name ?? "—"}
                  </td>
                  <td className="p-3 font-medium">
                    ${parseFloat(p.price).toFixed(2)}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={p.stock > 10 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {p.stock}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleFeatured(p.id)}
                      disabled={togglingId === p.id}
                      title={p.featured ? "Remove from featured" : "Mark as featured"}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        p.featured
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <span>{p.featured ? "⭐" : "☆"}</span>
                      <span>{togglingId === p.id ? "…" : p.featured ? "Featured" : "Set Featured"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
