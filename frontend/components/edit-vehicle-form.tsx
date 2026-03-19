"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import type { VehicleWithRelations } from "@/types/vehicle";

export function EditVehicleForm({ vehicle }: { vehicle: VehicleWithRelations }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsSubmitting(true);

    const imageUrls = String(formData.get("imageUrls") ?? "")
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);

    const payload = {
      title: String(formData.get("title") ?? ""),
      price: Number(formData.get("price") ?? 0),
      brand: String(formData.get("brand") ?? ""),
      model: String(formData.get("model") ?? ""),
      year: Number(formData.get("year") ?? 0),
      mileage: Number(formData.get("mileage") ?? 0),
      location: String(formData.get("location") ?? ""),
      description: String(formData.get("description") ?? ""),
      imageUrls,
    };

    const response = await fetch(`/api/vehicles/${vehicle.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setError("Unable to update listing. Please review your data.");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      action={handleSubmit}
      className="grid gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
    >
      <h1 className="text-2xl font-semibold tracking-tight">Edit Vehicle</h1>

      <Input name="title" defaultValue={vehicle.title} required placeholder="Title" />

      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="brand" defaultValue={vehicle.brand} required placeholder="Brand" />
        <Input name="model" defaultValue={vehicle.model} required placeholder="Model" />
        <Input name="price" defaultValue={vehicle.price} type="number" min={1} required placeholder="Price" />
        <Input name="year" defaultValue={vehicle.year} type="number" min={1900} required placeholder="Year" />
        <Input name="mileage" defaultValue={vehicle.mileage} type="number" min={0} required placeholder="Mileage" />
        <Input name="location" defaultValue={vehicle.location} required placeholder="Location" />
      </div>

      <Textarea
        name="description"
        defaultValue={vehicle.description}
        required
        placeholder="Description"
      />

      <Textarea
        name="imageUrls"
        defaultValue={vehicle.images.map((image) => image.imageUrl).join("\n")}
        placeholder="One image URL per line"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
