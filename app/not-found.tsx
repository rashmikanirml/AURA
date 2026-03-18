import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-xl border border-border bg-white p-10 text-center shadow-sm">
      <h1 className="text-3xl font-bold tracking-tight">Listing Not Found</h1>
      <p className="text-sm text-muted">
        The vehicle you are looking for does not exist or has been removed.
      </p>
      <Link
        href="/vehicles"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Back to Listings
      </Link>
    </section>
  );
}
