"use client";

import { useState } from "react";
import { SearchBar, type VehicleFilters } from "@/app/components/search-bar";
import { VehicleList } from "@/app/components/vehicle-list";

export default function VehiclesPage() {
  const [filters, setFilters] = useState<VehicleFilters>({});

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Listings</h1>
        <p className="text-sm text-muted">Filter by brand, location, and price range.</p>
      </div>
      <SearchBar onSearch={setFilters} />
      <VehicleList filters={filters} />
    </section>
  );
}
