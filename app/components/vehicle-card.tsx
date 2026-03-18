import Link from "next/link";
import { MapPin } from "lucide-react";
import type { VehicleWithRelations } from "@/types/vehicle";

export function VehicleCard({ vehicle }: { vehicle: VehicleWithRelations }) {
  const image = vehicle.images[0]?.imageUrl;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="relative h-44 w-full bg-slate-100">
        {image ? (
          <img src={image} alt={vehicle.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted">
            No image provided
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-foreground">{vehicle.title}</h3>
          <span className="whitespace-nowrap text-sm font-semibold text-primary">
            ${vehicle.price.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-muted">
          {vehicle.brand} {vehicle.model} • {vehicle.year} • {vehicle.mileage.toLocaleString()} km
        </p>
        <p className="flex items-center gap-1 text-sm text-muted">
          <MapPin className="h-4 w-4" />
          {vehicle.location}
        </p>
        <Link
          href={`/vehicles/${vehicle.id}`}
          className="inline-flex rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-95"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
