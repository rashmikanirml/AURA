import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { EditVehicleForm } from "@/app/components/edit-vehicle-form";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function EditVehiclePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedParams = "then" in params ? await params : params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: resolvedParams.id },
    include: {
      images: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  if (!vehicle) {
    notFound();
  }

  if (vehicle.userId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <section className="w-full">
      <EditVehicleForm
        vehicle={{
          ...vehicle,
          createdAt: vehicle.createdAt.toISOString(),
          approvedAt: vehicle.approvedAt ? vehicle.approvedAt.toISOString() : null,
        }}
      />
    </section>
  );
}
