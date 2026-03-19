import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardVehicleActions } from "@/app/components/dashboard-vehicle-actions";
import { Button } from "@/app/components/ui/button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type DashboardPageProps = {
  searchParams?: Promise<{ submitted?: string }> | { submitted?: string };
};

const statusLabel: Record<"PENDING" | "APPROVED" | "REJECTED", string> = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedSearchParams = searchParams
    ? "then" in searchParams
      ? await searchParams
      : searchParams
    : {};

  const vehicles = await prisma.vehicle.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <section className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-sm text-muted">Manage your active vehicle listings.</p>
        </div>
        <Link href="/sell">
          <Button>Create Listing</Button>
        </Link>
      </div>

      {resolvedSearchParams.submitted === "1" ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Listing request submitted. It will be posted after admin approval.
        </div>
      ) : null}

      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          {notification.message}
        </div>
      ))}

      {!vehicles.length ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-6 text-sm text-muted">
          You have no listings yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t border-border">
                  <td className="px-4 py-3">{vehicle.title}</td>
                  <td className="px-4 py-3">${vehicle.price.toLocaleString()}</td>
                  <td className="px-4 py-3">{vehicle.location}</td>
                  <td className="px-4 py-3">{statusLabel[vehicle.status]}</td>
                  <td className="px-4 py-3">
                    <DashboardVehicleActions vehicleId={vehicle.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
