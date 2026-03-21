"use client";

import { useState } from "react";
import { AICarChat } from "@/app/components/ai-car-chat";
import { SearchBar, type VehicleFilters } from "@/app/components/search-bar";
import { VehicleList } from "@/app/components/vehicle-list";

export default function Home() {
  const [filters, setFilters] = useState<VehicleFilters>({});

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Find Your Next Vehicle</h1>
        <p className="text-sm text-muted">
          Browse verified listings, compare prices, and connect directly with sellers.
        </p>
      </div>

      <AICarChat />
      <SearchBar onSearch={setFilters} />
      <VehicleList filters={filters} />
    </section>
  );
}
