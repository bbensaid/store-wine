"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterSidebar from "@/components/products/FilterSidebar";
import { useCallback, useState } from "react";

export default function ProductsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: Record<string, string> = Object.fromEntries(
    searchParams.entries()
  );

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleFiltersChanged = useCallback(
    (newFilters: Record<string, string>) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== "" && value !== "all" && value != null) {
          params.set(key, String(value));
        }
      });
      params.set("page", "0");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname]
  );

  const handleResetFilters = useCallback(() => {
    router.replace(pathname);
  }, [router, pathname]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[15%_70%_15%] min-h-screen">
      {/* Sidebar in left 15% */}
      <div className="h-full">
        <FilterSidebar
          filters={filters}
          onFiltersChanged={handleFiltersChanged}
          onResetFilters={handleResetFilters}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
      </div>
      {/* Main content in center 70% */}
      <div className="w-full h-full">{children}</div>
      {/* Right 15% empty for symmetry */}
      <div className="hidden md:block" />
    </div>
  );
}
