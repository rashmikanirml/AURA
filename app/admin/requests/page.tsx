import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminApprovalActions } from "@/app/components/admin-approval-actions";
import { ProfileOverviewCard } from "@/app/components/profile-overview-card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminRequestsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const profile = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
      createdAt: true,
    },
  });

  const pendingVehicles = await prisma.vehicle.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <section className="flex w-full flex-col gap-5">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Review Queue</h1>
        <p className="text-sm text-muted">Approve user listing requests before publishing.</p>
      </div>

      <ProfileOverviewCard
        name={profile?.name ?? session.user.name ?? "Admin Profile"}
        email={profile?.email ?? session.user.email}
        joinedAt={profile?.createdAt}
        roleLabel="Admin profile"
      />

      {!pendingVehicles.length ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-6 text-sm text-muted">
          No pending listing requests.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Seller</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t border-border">
                  <td className="px-4 py-3">{vehicle.title}</td>
                  <td className="px-4 py-3">${vehicle.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {vehicle.user?.name ?? "Unknown"}
                    <div className="text-xs text-muted">{vehicle.user?.email}</div>
                  </td>
                  <td className="px-4 py-3">{vehicle.createdAt.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <AdminApprovalActions vehicleId={vehicle.id} />
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
