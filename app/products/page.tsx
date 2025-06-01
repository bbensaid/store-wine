"use client";

import { useState, useEffect } from "react";
import ProductsPageGrid from "@/components/products/ProductsPageGrid";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({});

  // Listen for filter changes from the sidebar
  useEffect(() => {
    const handleFiltersChanged = (event: CustomEvent) => {
      fetchProducts(event.detail);
    };

    window.addEventListener(
      "filtersChanged",
      handleFiltersChanged as EventListener
    );

    // Initial fetch
    fetchProducts();

    return () => {
      window.removeEventListener(
        "filtersChanged",
        handleFiltersChanged as EventListener
      );
    };
  }, []);

  const fetchProducts = async (filters = {}) => {
    setIsLoading(true);
    try {
      const queryString = Object.entries(filters)
        .filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      const url = `/api/products${queryString ? `?${queryString}` : ""}`;
      const response = await fetch(url);

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      setProducts(data);
      setCurrentFilters(filters);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSearchSummary = (filters: any) => {
    const summaryParts = [];

    if (filters.type) summaryParts.push(filters.type);
    if (filters.body) summaryParts.push(filters.body);
    if (filters.acidity) summaryParts.push(filters.acidity);
    if (filters.country) summaryParts.push(filters.country);
    if (filters.featured) summaryParts.push("Featured");
    if (filters.priceMin || filters.priceMax) {
      const priceRange = `$${filters.priceMin || "0"}-$${
        filters.priceMax || "∞"
      }`;
      summaryParts.push(priceRange);
    }
    if (filters.ratingMin || filters.ratingMax) {
      const ratingRange = `${filters.ratingMin || "0"}★-${
        filters.ratingMax || "5"
      }★`;
      summaryParts.push(ratingRange);
    }

    return summaryParts.length > 0
      ? `${products.length} wines found • ${summaryParts.join(" • ")}`
      : `All Wines (${products.length})`;
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
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            {getSearchSummary(currentFilters)}
          </h2>
          <ProductsPageGrid products={products} />
        </>
      )}
    </div>
  );
}
