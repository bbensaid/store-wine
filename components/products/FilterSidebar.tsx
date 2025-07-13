import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

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
      <Label className={cinzel.className}>Wine Type</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="type-all"
            checked={value === "all"}
            onCheckedChange={() => onChange("all")}
          />
          <Label htmlFor="type-all" className={cinzel.className}>All Types</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="type-red"
            checked={value === "red"}
            onCheckedChange={() => onChange("red")}
          />
          <Label htmlFor="type-red" className={cinzel.className}>Red</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="type-white"
            checked={value === "white"}
            onCheckedChange={() => onChange("white")}
          />
          <Label htmlFor="type-white" className={cinzel.className}>White</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="type-rose"
            checked={value === "rose"}
            onCheckedChange={() => onChange("rose")}
          />
          <Label htmlFor="type-rose" className={cinzel.className}>Rosé</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="type-sparkling"
            checked={value === "sparkling"}
            onCheckedChange={() => onChange("sparkling")}
          />
          <Label htmlFor="type-sparkling" className={cinzel.className}>Sparkling</Label>
        </div>
      </div>
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
      <Label className={cinzel.className}>Body</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="body-all"
            checked={value === "all"}
            onCheckedChange={() => onChange("all")}
          />
          <Label htmlFor="body-all" className={cinzel.className}>All Bodies</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="body-light"
            checked={value === "light"}
            onCheckedChange={() => onChange("light")}
          />
          <Label htmlFor="body-light" className={cinzel.className}>Light</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="body-medium"
            checked={value === "medium"}
            onCheckedChange={() => onChange("medium")}
          />
          <Label htmlFor="body-medium" className={cinzel.className}>Medium</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="body-full"
            checked={value === "full"}
            onCheckedChange={() => onChange("full")}
          />
          <Label htmlFor="body-full" className={cinzel.className}>Full</Label>
        </div>
      </div>
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
      <Label className={cinzel.className}>Acidity</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acidity-all"
            checked={value === "all"}
            onCheckedChange={() => onChange("all")}
          />
          <Label htmlFor="acidity-all" className={cinzel.className}>All Acidities</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acidity-low"
            checked={value === "low"}
            onCheckedChange={() => onChange("low")}
          />
          <Label htmlFor="acidity-low" className={cinzel.className}>Low</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acidity-medium"
            checked={value === "medium"}
            onCheckedChange={() => onChange("medium")}
          />
          <Label htmlFor="acidity-medium" className={cinzel.className}>Medium</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acidity-high"
            checked={value === "high"}
            onCheckedChange={() => onChange("high")}
          />
          <Label htmlFor="acidity-high" className={cinzel.className}>High</Label>
        </div>
      </div>
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
      <Label className={cinzel.className}>Country</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="country-all"
            checked={value === "all"}
            onCheckedChange={() => onChange("all")}
          />
          <Label htmlFor="country-all" className={cinzel.className}>All Countries</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="country-france"
            checked={value === "france"}
            onCheckedChange={() => onChange("france")}
          />
          <Label htmlFor="country-france" className={cinzel.className}>France</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="country-italy"
            checked={value === "italy"}
            onCheckedChange={() => onChange("italy")}
          />
          <Label htmlFor="country-italy" className={cinzel.className}>Italy</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="country-spain"
            checked={value === "spain"}
            onCheckedChange={() => onChange("spain")}
          />
          <Label htmlFor="country-spain" className={cinzel.className}>Spain</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="country-usa"
            checked={value === "usa"}
            onCheckedChange={() => onChange("usa")}
          />
          <Label htmlFor="country-usa" className={cinzel.className}>USA</Label>
        </div>
      </div>
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
      <Label className={cinzel.className}>Rating Range</Label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={min ?? ""}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="Min"
          className="w-20"
        />
        <span>-</span>
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={max ?? ""}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Max"
          className="w-20"
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
      <Label className={cinzel.className}>Price Range</Label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="0"
          step="0.01"
          value={min ?? ""}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="Min"
          className="w-20"
        />
        <span>-</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={max ?? ""}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Max"
          className="w-20"
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
      <Label htmlFor="featured" className={cinzel.className}>Featured Wines</Label>
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
      bg-background border-r border-red-800 shadow-lg
      transition-all duration-300 overflow-y-auto
      ${isCollapsed ? "w-16" : "w-52"}
    `}
      aria-label="Product filters sidebar"
    >
      <div className="p-4 sticky top-0 bg-background z-10 border border-b-red-800 border-t-0 border-l-0 border-r-0">
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
              <span className={`text-xs hidden md:block ${cinzel.className}`}>Expand</span>
            </>
          ) : (
            <>
              <ChevronLeft />
              <span className={`text-xs hidden md:block ${cinzel.className}`}>Collapse</span>
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
            <Label htmlFor="dynamic-filtering" className={cinzel.className}>Dynamic Filtering</Label>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div
          id="sidebar-filters-content"
          role="region"
          aria-label="Filter options"
          className={`p-4 space-y-6 ${cinzel.className}`}
        >
          <Button
            onClick={handleReset}
            variant="outline"
            className={`mb-2 w-full ${cinzel.className}`}
            aria-label="Reset all filters"
          >
            Reset Filter
          </Button>
          {!dynamicFiltering && (
            <Button
              onClick={handleApplyFilters}
              variant="outline"
              className={`w-full ${cinzel.className}`}
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
