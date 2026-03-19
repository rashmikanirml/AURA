"use client";

import { useEffect, useState } from "react";
import type { VehicleFilters } from "@/app/components/search-bar";
import { VehicleCard } from "@/app/components/vehicle-card";
import type { VehicleWithRelations } from "@/types/vehicle";

export function VehicleList({ filters }: { filters: VehicleFilters }) {
  const [vehicles, setVehicles] = useState<VehicleWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadVehicles() {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (filters.search) params.set("search", filters.search);
      if (filters.brand) params.set("brand", filters.brand);
      if (filters.location) params.set("location", filters.location);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);

      const response = await fetch(`/api/vehicles?${params.toString()}`, {
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        setVehicles([]);
        setIsLoading(false);
        return;
      }

      const data = (await response.json()) as VehicleWithRelations[];
      setVehicles(data);
      setIsLoading(false);
    }

    loadVehicles().catch(() => {
      setVehicles([]);
      setIsLoading(false);
    });

    return () => controller.abort();
  }, [filters.brand, filters.location, filters.maxPrice, filters.search]);

  if (isLoading) {
    return <p className="text-sm text-muted">Loading vehicles...</p>;
  }

  if (!vehicles.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-white p-6 text-sm text-muted">
        No vehicles found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </section>
  );
}
