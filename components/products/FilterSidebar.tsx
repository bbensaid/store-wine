"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import debounce from "lodash/debounce";

interface FilterState {
  type: string;
  body: string;
  acidity: string;
  abv: {
    min: number | null;
    max: number | null;
  };
  price: {
    min: number | null;
    max: number | null;
  };
  rating: {
    min: number | null;
    max: number | null;
  };
  featured: boolean;
  country: string;
}

interface FilterSidebarProps {
  onFiltersChange: (filters: FilterState) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function FilterSidebar({
  onFiltersChange,
  isCollapsed,
  onToggleCollapse,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    body: "",
    acidity: "",
    abv: { min: null, max: null },
    price: { min: null, max: null },
    rating: { min: null, max: null },
    featured: false,
    country: "",
  });
  const [isDynamicFiltering, setIsDynamicFiltering] = useState(false);

  // Debounced filter change handler
  const debouncedFilterChange = useCallback(
    debounce((newFilters: FilterState) => {
      const cleanFilters = transformFilters(newFilters);
      onFiltersChange(cleanFilters);
    }, 500),
    []
  );

  const handleFilterChange = (key: string, value: any) => {
    let newFilters = { ...filters };

    if (key.includes(".")) {
      const [parent, child] = key.split(".");
      newFilters = {
        ...filters,
        [parent]: {
          ...filters[parent],
          [child]: value === "" ? null : Number(value),
        },
      };
    } else {
      newFilters = {
        ...filters,
        [key]: value,
      };
    }

    setFilters(newFilters);

    if (isDynamicFiltering) {
      debouncedFilterChange(newFilters);
    }
  };

  const handleApplyFilters = () => {
    if (!isDynamicFiltering) {
      const cleanFilters = transformFilters(filters);
      onFiltersChange(cleanFilters);
    }
  };

  const transformFilters = (filters: FilterState) => {
    return Object.entries(filters).reduce((acc: any, [key, value]) => {
      if (key === "body" && value) {
        acc[key] =
          value === "full"
            ? "Full-bodied"
            : value === "medium"
            ? "Medium-bodied"
            : value === "light"
            ? "Light-bodied"
            : value;
      } else if (
        key === "price" &&
        (value.min !== null || value.max !== null)
      ) {
        acc.priceMin = value.min;
        acc.priceMax = value.max;
      } else if (
        key === "rating" &&
        (value.min !== null || value.max !== null)
      ) {
        acc.ratingMin = value.min;
        acc.ratingMax = value.max;
      } else if (value !== "" && value !== null && value !== false) {
        acc[key] = value;
      }
      return acc;
    }, {});
  };

  return (
    <div
      className={`
      h-screen bg-white border-r border-gray-200 shadow-lg
      transition-all duration-300 overflow-y-auto
      ${isCollapsed ? "w-14" : "w-56"}
    `}
    >
      <div className="p-4 sticky top-0 bg-white z-10 border-b border-gray-200">
        <Button
          variant="ghost"
          onClick={onToggleCollapse}
          className="w-full flex flex-col items-center gap-1"
        >
          {isCollapsed ? (
            <>
              <ChevronRight />
              <span className="text-xs hidden md:block text-gray-500">
                Expand
              </span>
            </>
          ) : (
            <>
              <ChevronLeft />
              <span className="text-xs hidden md:block text-gray-500">
                Collapse
              </span>
            </>
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-6">
          {/* Dynamic Filtering Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dynamicFiltering"
              checked={isDynamicFiltering}
              onCheckedChange={(checked) =>
                setIsDynamicFiltering(checked as boolean)
              }
            />
            <Label htmlFor="dynamicFiltering">Dynamic Filtering</Label>
          </div>

          <div className="mt-8 space-y-6">
            {/* Wine Type */}
            <div className="space-y-2">
              <Label>Wine Type</Label>
              <Select
                value={filters.type || "all"}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="rose">Rosé</SelectItem>
                  <SelectItem value="sparkling">Sparkling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Body */}
            <div className="space-y-2">
              <Label>Body</Label>
              <Select
                value={filters.body || "all"}
                onValueChange={(value) => handleFilterChange("body", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select body" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Body Types</SelectItem>
                  <SelectItem value="light">Light-bodied</SelectItem>
                  <SelectItem value="medium">Medium-bodied</SelectItem>
                  <SelectItem value="full">Full-bodied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Acidity */}
            <div className="space-y-2">
              <Label>Acidity</Label>
              <Select
                value={filters.acidity || "all"}
                onValueChange={(value) => handleFilterChange("acidity", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select acidity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Acidity Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label>Country</Label>
              <Select
                value={filters.country || "all"}
                onValueChange={(value) => handleFilterChange("country", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Italy">Italy</SelectItem>
                  <SelectItem value="Portugal">Portugal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rating Range */}
            <div className="space-y-2">
              <Label>Rating Range</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  max={5}
                  step={0.5}
                  value={filters.rating?.min ?? ""}
                  onChange={(e) =>
                    handleFilterChange("rating.min", e.target.value)
                  }
                  placeholder="Min"
                  className="w-24"
                />
                <Input
                  type="number"
                  min={0}
                  max={5}
                  step={0.5}
                  value={filters.rating?.max ?? ""}
                  onChange={(e) =>
                    handleFilterChange("rating.max", e.target.value)
                  }
                  placeholder="Max"
                  className="w-24"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>Price Range ($)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  value={filters.price?.min ?? ""}
                  onChange={(e) =>
                    handleFilterChange("price.min", e.target.value)
                  }
                  placeholder="Min"
                  className="w-24"
                />
                <Input
                  type="number"
                  min={0}
                  value={filters.price?.max ?? ""}
                  onChange={(e) =>
                    handleFilterChange("price.max", e.target.value)
                  }
                  placeholder="Max"
                  className="w-24"
                />
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featured}
                onCheckedChange={(checked) =>
                  handleFilterChange("featured", checked)
                }
              />
              <Label htmlFor="featured">Featured Wines</Label>
            </div>

            {/* Apply Filters Button */}
            <Button
              className="w-[98%] mt-6 mx-auto"
              onClick={handleApplyFilters}
              disabled={isDynamicFiltering}
              variant={isDynamicFiltering ? "outline" : "default"}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
