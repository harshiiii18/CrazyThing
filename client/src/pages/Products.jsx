import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import FilterPanel from "../components/product/FilterPanel";
import EmptyState from "../components/ui/EmptyState";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Popularity" },
];

function mapToCardShape(p) {
  return {
    id: p._id,
    title: p.title,
    price: p.price,
    condition: p.condition?.replaceAll("_", " "),
    location: p.location,
    image: p.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    sellerName: p.seller?.name || "Seller",
    sellerVerified: p.seller?.sellerVerification?.status === "VERIFIED",
  };
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    condition: "",
    verifiedOnly: false,
  });
  const [sort, setSort] = useState("newest");

  // Debounce free-text search into the URL/query state
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (searchInput) next.set("q", searchInput);
      else next.delete("q");
      setSearchParams(next, { replace: true });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    categoryService.list().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = {
      q: searchParams.get("q") || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      condition: filters.condition || undefined,
      verifiedOnly: filters.verifiedOnly || undefined,
      sort,
    };
    productService
      .list(params)
      .then((res) => setResults(res.data))
      .catch((err) => setError(err.message || "Could not load listings"))
      .finally(() => setLoading(false));
  }, [filters, sort, searchParams]);

  const cards = useMemo(() => results.map(mapToCardShape), [results]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink_text-hi">
            {searchParams.get("q") ? `Results for “${searchParams.get("q")}”` : "Browse everything"}
          </h1>
          <p className="mt-1 text-sm text-ink_text-mid">{results.length} listings</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Refine your search…"
            className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink_text-hi outline-none focus:border-ember sm:w-64"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-line bg-surface px-3 py-2 text-sm text-ink_text-hi outline-none focus:border-ember"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="rounded-full border border-line p-2.5 text-ink_text-mid lg:hidden"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel filters={filters} onChange={setFilters} categories={categories} />
        </aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-ink/80 backdrop-blur-sm lg:hidden">
            <div className="h-full w-72 overflow-y-auto bg-surface p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-lg text-ink_text-hi">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <X size={20} className="text-ink_text-mid" />
                </button>
              </div>
              <FilterPanel filters={filters} onChange={setFilters} categories={categories} />
            </div>
          </div>
        )}

        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-signal-red">{error}</p>
          ) : cards.length === 0 ? (
            <EmptyState
              title="No listings match those filters"
              description="Try widening your price range or clearing a filter."
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {cards.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
