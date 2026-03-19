"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";

export function AdminApprovalActions({ vehicleId }: { vehicleId: string }) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);

  async function approveVehicle() {
    setIsApproving(true);

    const response = await fetch(`/api/admin/vehicles/${vehicleId}/approve`, {
      method: "POST",
    });

    setIsApproving(false);

    if (!response.ok) {
      window.alert("Unable to approve this request.");
      return;
    }

    router.refresh();
  }

  return (
    <Button
      className="h-8 px-3 text-xs"
      disabled={isApproving}
      onClick={approveVehicle}
    >
      {isApproving ? "Approving..." : "Approve"}
    </Button>
  );
}
