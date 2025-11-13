import { useState } from "react";
import { MapPin, Filter, DollarSign, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  location: string;
  type: string;
  priceRange: number[];
  searchQuery: string;
}

export const ChatSidebar = ({ onFilterChange }: ChatSidebarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    location: "all",
    type: "all",
    priceRange: [0, 1000],
    searchQuery: "",
  });

  const handleFilterUpdate = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <Card className="p-6 h-full overflow-y-auto moroccan-pattern">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Filter className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Filters</h2>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            Search
          </Label>
          <Input
            placeholder="Search places..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterUpdate("searchQuery", e.target.value)}
            className="border-border"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Location
          </Label>
          <Select value={filters.location} onValueChange={(v) => handleFilterUpdate("location", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="marrakech">Marrakech</SelectItem>
              <SelectItem value="casablanca">Casablanca</SelectItem>
              <SelectItem value="fes">Fes</SelectItem>
              <SelectItem value="rabat">Rabat</SelectItem>
              <SelectItem value="tangier">Tangier</SelectItem>
              <SelectItem value="agadir">Agadir</SelectItem>
              <SelectItem value="essaouira">Essaouira</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-secondary" />
            Type
          </Label>
          <Select value={filters.type} onValueChange={(v) => handleFilterUpdate("type", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hotel">Hotels</SelectItem>
              <SelectItem value="riad">Riads</SelectItem>
              <SelectItem value="restaurant">Restaurants</SelectItem>
              <SelectItem value="cafe">Cafés</SelectItem>
              <SelectItem value="attraction">Attractions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent" />
            Price Range
          </Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(v) => handleFilterUpdate("priceRange", v)}
              max={1000}
              min={0}
              step={50}
              className="my-4"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        <Button className="w-full bg-gradient-moroccan text-white hover:opacity-90 transition-opacity">
          Apply Filters
        </Button>
      </div>

      {/* Quick Suggestions */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          Popular Searches
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Luxury Riads", "Traditional Cafés", "Rooftop Dining", "Medina Hotels"].map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
