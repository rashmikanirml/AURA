"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

export function SellForm() {
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

    const response = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setError("Unable to create listing. Check your fields and try again.");
      setIsSubmitting(false);
      return;
    }

    const created = (await response.json()) as { id: string };
    router.push(`/vehicles/${created.id}`);
    router.refresh();
  }

  return (
    <form
      action={handleSubmit}
      className="grid gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
    >
      <h1 className="text-2xl font-semibold tracking-tight">Sell Your Vehicle</h1>
      <p className="text-sm text-muted">
        Post your listing with all key specs and image links.
      </p>

      <Input name="title" required placeholder="Title (e.g. Toyota Corolla 2022)" />

      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="brand" required placeholder="Brand" />
        <Input name="model" required placeholder="Model" />
        <Input name="price" type="number" min={1} required placeholder="Price" />
        <Input name="year" type="number" min={1900} required placeholder="Year" />
        <Input name="mileage" type="number" min={0} required placeholder="Mileage (km)" />
        <Input name="location" required placeholder="Location" />
      </div>

      <Textarea
        name="description"
        required
        placeholder="Describe the vehicle condition, history, features, and financing details."
      />

      <Textarea
        name="imageUrls"
        placeholder="One image URL per line (https://...)"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Create Listing"}
      </Button>
    </form>
  );
}
