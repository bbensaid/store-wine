"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterSidebar from "@/components/products/FilterSidebar";
import { useCallback, useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

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
      {/* Mobile Filters Button and Drawer */}
      <div className="md:hidden p-2">
        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button className="w-full" aria-label="Open filters sidebar">
              Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-0 w-4/5 max-w-xs h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" aria-label="Close filters sidebar">
                  ×
                </Button>
              </DrawerClose>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                onFiltersChanged={(f) => {
                  handleFiltersChanged(f);
                }}
                onResetFilters={handleResetFilters}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      {/* Sidebar on desktop */}
      <div className="hidden md:block h-full">
        <FilterSidebar
          filters={filters}
          onFiltersChanged={handleFiltersChanged}
          onResetFilters={handleResetFilters}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
      </div>
      {/* Main content in center 70% */}
      <div className="w-full h-full col-span-1 md:col-span-1">{children}</div>
      {/* Right 15% empty for symmetry */}
      <div className="hidden md:block" />
    </div>
  );
}
