"use client";

import { useState } from "react";
import { FilterSidebar } from "@/components/products/FilterSidebar";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="w-full">
      {/* Sidebar: hidden on mobile, exactly 15% on desktop */}
      <aside
        className={`hidden md:block fixed left-0 top-20 h-[calc(100vh-5rem)] w-[15%]`}
      >
        <FilterSidebar
          onFiltersChange={(filters) => {
            // This will be handled by the page component
            window.dispatchEvent(
              new CustomEvent("filtersChanged", { detail: filters })
            );
          }}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </aside>

      {/* Content: matches Container exactly - 70% with 15% on each side */}
      <div className="w-full px-4 md:w-[70%] md:mx-auto">{children}</div>
    </div>
  );
}
