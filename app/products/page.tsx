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

// Utility to normalize searchParams values to strings
function normalizeSearchParams(params: {
  [key: string]: string | string[] | undefined;
}): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = value[0] ?? "";
    }
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProductsPage({ searchParams }: any) {
  const normalizedParams = normalizeSearchParams(searchParams || {});
  // Extract filters and pagination from normalizedParams
  const page = parseInt(normalizedParams.page || "0", 10) || 0;
  const layout = normalizedParams.layout || "grid";

  // Fetch products and total count server-side
  const { products, totalCount } = await getProducts({
    filters: Object.fromEntries(
      Object.entries(normalizedParams).filter(([key]) => key !== "page")
    ),
    page,
    pageSize: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="w-full">
      {/* Header area aligned with grid */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-x-6 items-center mb-2">
        {/* Results count (left) */}
        <span
          className="text-xl font-normal"
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
        <div className="col-start-2 col-end-3 justify-self-center">
          <div className="flex items-center gap-6">
            <Button
              asChild
              disabled={page === 0}
              variant="default"
              size="lg"
              aria-label="Previous page"
            >
              <Link
                href={{
                  pathname: "/products",
                  query: sanitizeQuery({
                    ...normalizedParams,
                    page: Math.max(0, page - 1),
                  }),
                }}
                scroll={false}
              >
                Previous
              </Link>
            </Button>
            <span className="text-xl font-normal" style={{ color: "#8B0015" }}>
              Page {page + 1}/{totalPages}
            </span>
            <Button
              asChild
              disabled={page + 1 >= totalPages}
              variant="default"
              size="lg"
              aria-label="Next page"
            >
              <Link
                href={{
                  pathname: "/products",
                  query: sanitizeQuery({
                    ...normalizedParams,
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
        <div className="justify-self-end flex gap-x-4">
          <Button
            variant={layout === "grid" ? "default" : "ghost"}
            size="icon"
            asChild
            aria-label="Grid view"
          >
            <Link
              href={{
                pathname: "/products",
                query: sanitizeQuery({
                  ...normalizedParams,
                  layout: "grid",
                }),
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
                query: sanitizeQuery({
                  ...normalizedParams,
                  layout: "list",
                }),
              }}
              scroll={false}
            >
              <LuList />
            </Link>
          </Button>
        </div>
      </div>
      {/* Product grid or list display */}
      <div className="mt-10">
        <ProductsContainer layout={layout} products={products} />
      </div>
    </div>
  );
}
