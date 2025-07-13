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
    <div className="w-full">
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
      {/* Desktop layout with sidebar and content */}
      <div className="hidden md:flex">
        {/* Sidebar with left margin */}
        <div className="flex-shrink-0 pl-0">
          <FilterSidebar
            filters={filters}
            onFiltersChanged={handleFiltersChanged}
            onResetFilters={handleResetFilters}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          />
        </div>
        {/* Main content with big left margin */}
        <div className="flex-1 pl-24">
          {children}
        </div>
      </div>
      {/* Mobile content */}
      <div className="md:hidden">
        {children}
      </div>
    </div>
  );
}
