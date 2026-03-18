import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
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

const updateSchema = z.object({
  title: z.string().min(3).max(120),
  price: z.coerce.number().int().positive(),
  brand: z.string().min(2).max(40),
  model: z.string().min(1).max(40),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.coerce.number().int().min(0),
  location: z.string().min(2).max(120),
  description: z.string().min(10).max(4000),
  imageUrls: z.array(z.string().url()).max(6).default([]),
});

export async function GET(_: Request, context: RouteContext) {
  const { id } = await resolveParams(context.params);

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }

  return NextResponse.json(vehicle);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await resolveParams(context.params);
  const existing = await prisma.vehicle.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }

  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const payload = await request.json();
    const parsed = updateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        title: parsed.data.title,
        price: parsed.data.price,
        brand: parsed.data.brand,
        model: parsed.data.model,
        year: parsed.data.year,
        mileage: parsed.data.mileage,
        location: parsed.data.location,
        description: parsed.data.description,
        images: {
          deleteMany: {},
          create: parsed.data.imageUrls.map((imageUrl) => ({ imageUrl })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Unable to update this listing." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await resolveParams(context.params);
  const existing = await prisma.vehicle.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }

  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.vehicle.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
