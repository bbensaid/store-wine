"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import ProductsContainer from "@/components/products/ProductsContainer";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LuLayoutGrid, LuList } from "react-icons/lu";
import Link from "next/link";

const PAGE_SIZE = 20;

export default function ProductsPage() {
  // Get URL search parameters, router, and pathname for navigation and state
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Memoize the current page number from the URL (default to 0)
  const page = useMemo(() => {
    const p = parseInt(searchParams.get("page") || "0", 10);
    return isNaN(p) ? 0 : p;
  }, [searchParams]);

  // Extract all filters from the URL except for 'page'
  const filters = useMemo(
    () =>
      Object.fromEntries(
        Array.from(searchParams.entries()).filter(([key]) => key !== "page")
      ),
    [searchParams]
  );

  // Get the current layout (grid or list) and search term from the URL
  const layout = searchParams.get("layout") || "grid";
  const search = searchParams.get("search") || "";

  // State for products, total count, and loading status
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from the API based on filters and pagination
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build query string from filters
      const queryString = Object.entries(filters)
        .filter(
          ([, value]) =>
            value !== null &&
            value !== undefined &&
            value !== "" &&
            value !== "all"
        )
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
      const limit = PAGE_SIZE;
      const offset = page * PAGE_SIZE;
      // Fetch products with pagination and filters
      const url = `/api/products?${
        queryString ? `${queryString}&` : ""
      }limit=${limit}&offset=${offset}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProducts(Array.isArray(data.wines) ? data.wines : []);
      setTotalCount(typeof data.totalCount === "number" ? data.totalCount : 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  // Refetch products whenever filters or page changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Calculate total number of pages for pagination
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Update the URL to change the current page (triggers re-fetch)
  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          <p className="mt-4 text-gray-500">Loading wines...</p>
        </div>
      ) : (
        <>
          <div className="container mx-auto">
            {/* Header row: left = results count, center = pagination, right = grid/list toggle */}
            <div className="flex items-center justify-between mb-2">
              {/* Results count (left) */}
              <span
                className="text-sm"
                style={{ color: "#8B0015" }}
                role="status"
                aria-live="polite"
              >
                {(() => {
                  const start = totalCount === 0 ? 0 : page * PAGE_SIZE + 1;
                  const end =
                    totalCount === 0
                      ? 0
                      : Math.min((page + 1) * PAGE_SIZE, totalCount);
                  return `Showing wines ${start} ... ${end} out of ${totalCount} found`;
                })()}
              </span>
              {/* Pagination controls (center) */}
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => goToPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    variant="default"
                    aria-label="Previous page"
                  >
                    Previous
                  </Button>
                  <span className="text-sm" style={{ color: "#8B0015" }}>
                    Page {page + 1}/{totalPages}
                  </span>
                  <Button
                    onClick={() => goToPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page + 1 >= totalPages}
                    variant="default"
                    aria-label="Next page"
                  >
                    Next
                  </Button>
                </div>
              </div>
              {/* Grid/List toggle buttons (right) */}
              <div className="flex gap-x-4">
                <Button
                  variant={layout === "grid" ? "default" : "ghost"}
                  size="icon"
                  asChild
                  aria-label="Grid view"
                >
                  <Link
                    href={`/products?layout=grid${
                      search ? `&search=${search}` : ""
                    }`}
                  >
                    {" "}
                    <LuLayoutGrid />{" "}
                  </Link>
                </Button>
                <Button
                  variant={layout === "list" ? "default" : "ghost"}
                  size="icon"
                  asChild
                  aria-label="List view"
                >
                  <Link
                    href={`/products?layout=list${
                      search ? `&search=${search}` : ""
                    }`}
                  >
                    {" "}
                    <LuList />{" "}
                  </Link>
                </Button>
              </div>
            </div>
            {/* Product grid or list display */}
            <ProductsContainer
              layout={layout}
              search={search}
              products={products}
            />
          </div>
        </>
      )}
    </div>
  );
}
