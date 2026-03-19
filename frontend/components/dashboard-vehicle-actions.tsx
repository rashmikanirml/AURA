"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";

export function DashboardVehicleActions({ vehicleId }: { vehicleId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function deleteVehicle() {
    const confirmed = window.confirm("Delete this listing permanently?");
    if (!confirmed) return;

    setIsDeleting(true);

    const response = await fetch(`/api/vehicles/${vehicleId}`, {
      method: "DELETE",
    });

    setIsDeleting(false);

    if (response.ok) {
      router.refresh();
      return;
    }

    window.alert("Could not delete this listing.");
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/dashboard/${vehicleId}/edit`}>
        <Button variant="secondary" className="h-8 px-3 text-xs">
          Edit
        </Button>
      </Link>
      <Button
        variant="destructive"
        className="h-8 px-3 text-xs"
        disabled={isDeleting}
        onClick={deleteVehicle}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
