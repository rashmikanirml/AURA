import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function resolveParams(params: RouteContext["params"]) {
  if ("then" in params) {
    return params;
  }

  return Promise.resolve(params);
}

export async function POST(_: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await resolveParams(context.params);

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      title: true,
      status: true,
    },
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }

  if (vehicle.status === "APPROVED") {
    return NextResponse.json({ success: true });
  }

  await prisma.$transaction([
    prisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    }),
    prisma.notification.create({
      data: {
        userId: vehicle.userId,
        message: `Your listing \"${vehicle.title}\" was approved and is now live.`,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
