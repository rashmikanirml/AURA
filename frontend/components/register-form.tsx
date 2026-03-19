"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdminRegistration, setIsAdminRegistration] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      isAdmin: isAdminRegistration,
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Unable to register. Email may already be in use.");
      return;
    }

    router.push("/login");
  }

  return (
    <form action={handleSubmit} className="grid gap-3 rounded-xl border border-border bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
      <Input name="name" required placeholder="Full name" />
      <Input name="email" type="email" required placeholder="Email" />
      <Input name="password" type="password" minLength={6} required placeholder="Password" />
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={isAdminRegistration}
          onChange={(event) => setIsAdminRegistration(event.target.checked)}
        />
        Register as admin
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Register"}
      </Button>
    </form>
  );
}
