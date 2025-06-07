import { useState, useEffect } from "react";
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
import { useDebouncedCallback } from "use-debounce";

interface FilterSidebarProps {
  filters: Record<string, string>;
  onFiltersChanged: (filters: Record<string, string>) => void;
  onResetFilters: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function WineTypeFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Wine Type</Label>
      <Select value={value || "all"} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select type" className="" />
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
  );
}

function BodyFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Body</Label>
      <Select value={value || "all"} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select body" className="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Body Types</SelectItem>
          <SelectItem value="light">Light-bodied</SelectItem>
          <SelectItem value="medium">Medium-bodied</SelectItem>
          <SelectItem value="full">Full-bodied</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function AcidityFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Acidity</Label>
      <Select value={value || "all"} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select acidity" className="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Acidity Levels</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function CountryFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Country</Label>
      <Select value={value || "all"} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select country" className="" />
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
  );
}

function RatingRangeFilter({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: string;
  max: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Rating Range</Label>
      <div className="flex gap-2">
        <Input
          type="number"
          min={0}
          max={5}
          step={0.5}
          value={min ?? ""}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="Min"
          className="w-24"
        />
        <Input
          type="number"
          min={0}
          max={5}
          step={0.5}
          value={max ?? ""}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Max"
          className="w-24"
        />
      </div>
    </div>
  );
}

function PriceRangeFilter({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: string;
  max: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Price Range ($)</Label>
      <div className="flex gap-2">
        <Input
          type="number"
          min={0}
          value={min ?? ""}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="Min"
          className="w-24"
        />
        <Input
          type="number"
          min={0}
          value={max ?? ""}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Max"
          className="w-24"
        />
      </div>
    </div>
  );
}

function FeaturedFilter({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="featured" checked={checked} onCheckedChange={onChange} />
      <Label htmlFor="featured">Featured Wines</Label>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFiltersChanged,
  onResetFilters,
  isCollapsed,
  onToggleCollapse,
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] =
    useState<Record<string, string>>(filters);
  const [dynamicFiltering, setDynamicFiltering] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (dynamicFiltering) {
      debouncedApplyFilters({
        ...localFilters,
        [key]: value,
      });
    }
  };

  const handleApplyFilters = () => {
    onFiltersChanged(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    onResetFilters();
  };

  const debouncedApplyFilters = useDebouncedCallback((filters) => {
    onFiltersChanged(filters);
  }, 300);

  return (
    <aside
      className={`
      h-screen bg-background dark:bg-background border-r border-gray-200 shadow-lg
      transition-all duration-300 overflow-y-auto
      ${isCollapsed ? "w-14" : "w-56"}
    `}
      aria-label="Product filters sidebar"
    >
      <div className="p-4 sticky top-0 bg-background dark:bg-background z-10 border-b border-gray-200">
        <Button
          variant="ghost"
          onClick={onToggleCollapse}
          className="w-full flex flex-col items-center gap-1"
          aria-expanded={!isCollapsed}
          aria-controls="sidebar-filters-content"
        >
          {isCollapsed ? (
            <>
              <ChevronRight />
              <span className="text-xs hidden md:block">Expand</span>
            </>
          ) : (
            <>
              <ChevronLeft />
              <span className="text-xs hidden md:block">Collapse</span>
            </>
          )}
        </Button>
        {!isCollapsed && (
          <div className="mt-4 flex items-center space-x-2">
            <Checkbox
              id="dynamic-filtering"
              checked={dynamicFiltering}
              onCheckedChange={(checked) => setDynamicFiltering(!!checked)}
              aria-checked={dynamicFiltering}
            />
            <Label htmlFor="dynamic-filtering">Dynamic Filtering</Label>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div
          id="sidebar-filters-content"
          role="region"
          aria-label="Filter options"
          className="p-4 space-y-6"
        >
          <Button
            onClick={handleReset}
            variant="default"
            className="mb-2 w-full border-[#8B0015] bg-[#8B0015] text-white hover:bg-[#8B0015] hover:text-white hover:border-[#8B0015] focus-visible:ring-[#8B0015]"
            style={{ borderColor: "#8B0015" }}
            aria-label="Reset all filters"
          >
            Reset Filter
          </Button>
          {!dynamicFiltering && (
            <Button
              onClick={handleApplyFilters}
              variant="default"
              className="w-full border-[#8B0015] bg-[#8B0015] text-white hover:bg-[#8B0015] hover:text-white hover:border-[#8B0015] focus-visible:ring-[#8B0015]"
              style={{ borderColor: "#8B0015" }}
              aria-label="Apply selected filters"
            >
              Apply Filters
            </Button>
          )}

          <div className="mt-8 space-y-6">
            <fieldset>
              <legend className="sr-only">Wine Type</legend>
              <WineTypeFilter
                value={localFilters.type || "all"}
                onChange={(v) => handleChange("type", v)}
              />
            </fieldset>
            <Separator />
            <fieldset>
              <legend className="sr-only">Body</legend>
              <BodyFilter
                value={localFilters.body || "all"}
                onChange={(v) => handleChange("body", v)}
              />
            </fieldset>
            <fieldset>
              <legend className="sr-only">Acidity</legend>
              <AcidityFilter
                value={localFilters.acidity || "all"}
                onChange={(v) => handleChange("acidity", v)}
              />
            </fieldset>
            <fieldset>
              <legend className="sr-only">Country</legend>
              <CountryFilter
                value={localFilters.country || "all"}
                onChange={(v) => handleChange("country", v)}
              />
            </fieldset>
            <fieldset>
              <legend className="sr-only">Rating Range</legend>
              <RatingRangeFilter
                min={localFilters.ratingMin ?? ""}
                max={localFilters.ratingMax ?? ""}
                onMinChange={(v) => handleChange("ratingMin", v)}
                onMaxChange={(v) => handleChange("ratingMax", v)}
              />
            </fieldset>
            <fieldset>
              <legend className="sr-only">Price Range</legend>
              <PriceRangeFilter
                min={localFilters.priceMin ?? ""}
                max={localFilters.priceMax ?? ""}
                onMinChange={(v) => handleChange("priceMin", v)}
                onMaxChange={(v) => handleChange("priceMax", v)}
              />
            </fieldset>
            <fieldset>
              <legend className="sr-only">Featured Wines</legend>
              <FeaturedFilter
                checked={!!localFilters.featured}
                onChange={(checked) =>
                  handleChange("featured", checked ? "true" : "")
                }
              />
            </fieldset>
          </div>
        </div>
      )}
    </aside>
  );
}
