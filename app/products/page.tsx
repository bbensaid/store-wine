// Remove 'use client' to make this a server component
// import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductsContainer from "@/components/products/ProductsContainer";
import { Button } from "@/components/ui/button";
import { LuLayoutGrid, LuList } from "react-icons/lu";
import Link from "next/link";
import { getProducts } from "@/lib/getProducts";

const PAGE_SIZE = 20;

// Utility to ensure all query values are strings and filter out undefined/null
function sanitizeQuery(query: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(query)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  // Extract filters and pagination from searchParams
  const page = parseInt(searchParams.page || "0", 10) || 0;
  const layout = searchParams.layout || "grid";

  // Fetch products and total count server-side
  const { products, totalCount } = await getProducts({
    filters: Object.fromEntries(
      Object.entries(searchParams).filter(([key]) => key !== "page")
    ),
    page,
    pageSize: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="space-y-8">
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
                asChild
                disabled={page === 0}
                variant="default"
                aria-label="Previous page"
              >
                <Link
                  href={{
                    pathname: "/products",
                    query: sanitizeQuery({
                      ...searchParams,
                      page: Math.max(0, page - 1),
                    }),
                  }}
                  scroll={false}
                >
                  Previous
                </Link>
              </Button>
              <span className="text-sm" style={{ color: "#8B0015" }}>
                Page {page + 1}/{totalPages}
              </span>
              <Button
                asChild
                disabled={page + 1 >= totalPages}
                variant="default"
                aria-label="Next page"
              >
                <Link
                  href={{
                    pathname: "/products",
                    query: sanitizeQuery({
                      ...searchParams,
                      page: Math.min(totalPages - 1, page + 1),
                    }),
                  }}
                  scroll={false}
                >
                  Next
                </Link>
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
                href={{
                  pathname: "/products",
                  query: sanitizeQuery({ ...searchParams, layout: "grid" }),
                }}
                scroll={false}
              >
                <LuLayoutGrid />
              </Link>
            </Button>
            <Button
              variant={layout === "list" ? "default" : "ghost"}
              size="icon"
              asChild
              aria-label="List view"
            >
              <Link
                href={{
                  pathname: "/products",
                  query: sanitizeQuery({ ...searchParams, layout: "list" }),
                }}
                scroll={false}
              >
                <LuList />
              </Link>
            </Button>
          </div>
        </div>
        {/* Product grid or list display */}
        <ProductsContainer layout={layout} products={products} />
      </div>
    </div>
  );
}
