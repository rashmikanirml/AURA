"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";

export function AuthMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-sm text-muted">Checking session...</span>;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground">
          Login
        </Link>
        <Link href="/register">
          <Button className="h-9">Register</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {session.user.role === "ADMIN" ? (
        <Link
          href="/admin/requests"
          className="text-sm font-medium text-muted hover:text-foreground"
        >
          Admin Queue
        </Link>
      ) : null}
      <Link href="/dashboard" className="text-sm font-medium text-muted hover:text-foreground">
        {session.user.name ?? "Profile"}
      </Link>
      <Button variant="ghost" className="h-9" onClick={() => signOut({ callbackUrl: "/" })}>
        Logout
      </Button>
    </div>
  );
}
