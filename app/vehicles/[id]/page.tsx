import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function VehicleDetailsPage({ params }: PageProps) {
  const resolvedParams = "then" in params ? await params : params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: resolvedParams.id },
    include: {
      images: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!vehicle) {
    notFound();
  }

  return (
    <section className="grid w-full gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">{vehicle.title}</h1>
          <p className="mt-1 text-lg font-semibold text-primary">
            ${vehicle.price.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-muted">
            {vehicle.brand} {vehicle.model} • {vehicle.year} • {vehicle.mileage.toLocaleString()} km
          </p>
          <p className="mt-2 text-sm text-muted">Location: {vehicle.location}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {vehicle.images.length ? (
            vehicle.images.map((image) => (
              <img
                key={image.id}
                src={image.imageUrl}
                alt={vehicle.title}
                className="h-52 w-full rounded-lg border border-border object-cover"
              />
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-white p-6 text-sm text-muted">
              No images for this listing.
            </div>
          )}
        </div>

        <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-foreground">
            {vehicle.description}
          </p>
        </article>
      </div>

      <aside className="h-fit rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Seller Info</h2>
        <p className="mt-3 text-sm text-foreground">{vehicle.user?.name ?? "Private Seller"}</p>
        <p className="text-sm text-muted">{vehicle.user?.email}</p>
      </aside>
    </section>
  );
}
