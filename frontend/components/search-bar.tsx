"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export type VehicleFilters = {
  search?: string;
  brand?: string;
  location?: string;
  maxPrice?: string;
};

export function SearchBar({
  onSearch,
  initialFilters,
}: {
  onSearch: (filters: VehicleFilters) => void;
  initialFilters?: VehicleFilters;
}) {
  const [search, setSearch] = useState(initialFilters?.search ?? "");
  const [brand, setBrand] = useState(initialFilters?.brand ?? "");
  const [location, setLocation] = useState(initialFilters?.location ?? "");
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice ?? "");

  return (
    <form
      className="grid gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm md:grid-cols-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch({
          search,
          brand,
          location,
          maxPrice,
        });
      }}
    >
      <div className="md:col-span-2">
        <Input
          placeholder="Search title or keyword"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <Input
        placeholder="Brand"
        value={brand}
        onChange={(event) => setBrand(event.target.value)}
      />
      <Input
        placeholder="Location"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />
      <div className="flex gap-2">
        <Input
          placeholder="Max price"
          type="number"
          min={0}
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />
        <Button className="px-3" aria-label="Search vehicles">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
