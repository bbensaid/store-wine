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
      <Label className="text-primary">Wine Type</Label>
      <Select value={value || "all"} onValueChange={onChange}>
        <SelectTrigger className="text-primary border border-primary/20">
          <SelectValue placeholder="Select type" className="text-primary" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-primary">All Types</SelectItem>
          <SelectItem value="red" className="text-primary">Red</SelectItem>
          <SelectItem value="white" className="text-primary">White</SelectItem>
          <SelectItem value="rose" className="text-primary">Rosé</SelectItem>
          <SelectItem value="sparkling" className="text-primary">Sparkling</SelectItem>
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
      <Label className="text-primary">Body</Label>
      <Select value={value || "all"} onValueChange={onChange}>
        <SelectTrigger className="text-primary border border-primary/20">
          <SelectValue placeholder="Select body" className="text-primary" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-primary">All Body Types</SelectItem>
          <SelectItem value="light" className="text-primary">Light-bodied</SelectItem>
          <SelectItem value="medium" className="text-primary">Medium-bodied</SelectItem>
          <SelectItem value="full" className="text-primary">Full-bodied</SelectItem>
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
      <Label className="text-primary">Acidity</Label>
      <Select value={value || "all"} onValueChange={onChange}>
        <SelectTrigger className="text-primary border border-primary/20">
          <SelectValue placeholder="Select acidity" className="text-primary" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-primary">All Acidity Levels</SelectItem>
          <SelectItem value="low" className="text-primary">Low</SelectItem>
          <SelectItem value="medium" className="text-primary">Medium</SelectItem>
          <SelectItem value="high" className="text-primary">High</SelectItem>
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
      <Label className="text-primary">Country</Label>
      <Select value={value || "all"} onValueChange={onChange}>
        <SelectTrigger className="text-primary border border-primary/20">
          <SelectValue placeholder="Select country" className="text-primary" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-primary">All Countries</SelectItem>
          <SelectItem value="Spain" className="text-primary">Spain</SelectItem>
          <SelectItem value="France" className="text-primary">France</SelectItem>
          <SelectItem value="Italy" className="text-primary">Italy</SelectItem>
          <SelectItem value="Portugal" className="text-primary">Portugal</SelectItem>
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
      <Label className="text-primary">Rating Range</Label>
      <div className="flex gap-1.5">
        <Input
          type="number"
          min={0}
          max={5}
          step={0.5}
          value={min ?? ""}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="Min"
          className="w-20 text-primary placeholder:text-primary border border-primary/20"
        />
        <Input
          type="number"
          min={0}
          max={5}
          step={0.5}
          value={max ?? ""}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Max"
          className="w-20 text-primary placeholder:text-primary border border-primary/20"
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
      <Label className="text-primary">Price Range ($)</Label>
      <div className="flex gap-1.5">
        <Input
          type="number"
          min={0}
          value={min ?? ""}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="Min"
          className="w-20 text-primary placeholder:text-primary border border-primary/20"
        />
        <Input
          type="number"
          min={0}
          value={max ?? ""}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Max"
          className="w-20 text-primary placeholder:text-primary border border-primary/20"
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
      <Label htmlFor="featured" className="text-primary">Featured Wines</Label>
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
          className="w-full flex flex-col items-center gap-1 text-primary hover:text-primary"
          aria-expanded={!isCollapsed}
          aria-controls="sidebar-filters-content"
        >
          {isCollapsed ? (
            <>
              <ChevronRight className="text-primary" />
              <span className="text-xs hidden md:block text-primary">Expand</span>
            </>
          ) : (
            <>
              <ChevronLeft className="text-primary" />
              <span className="text-xs hidden md:block text-primary">Collapse</span>
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
            <Label htmlFor="dynamic-filtering" className="text-primary">Dynamic Filtering</Label>
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
            className="mb-2 w-full flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary"
            aria-label="Reset all filters"
          >
            Reset Filter
          </Button>
          {!dynamicFiltering && (
            <Button
              onClick={handleApplyFilters}
              className="w-full flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary"
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
