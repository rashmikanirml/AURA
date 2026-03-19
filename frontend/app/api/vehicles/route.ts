import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const vehicleSchema = z.object({
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brand = searchParams.get("brand") || undefined;
  const model = searchParams.get("model") || undefined;
  const location = searchParams.get("location") || undefined;
  const search = searchParams.get("search") || undefined;

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam =
    searchParams.get("maxPrice") ??
    searchParams.get("priceLt") ??
    searchParams.get("price<");

  const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;

  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: "APPROVED",
      brand: brand ? { contains: brand, mode: "insensitive" } : undefined,
      model: model ? { contains: model, mode: "insensitive" } : undefined,
      location: location
        ? { contains: location, mode: "insensitive" }
        : undefined,
      title: search ? { contains: search, mode: "insensitive" } : undefined,
      price: {
        gte: Number.isFinite(minPrice) ? minPrice : undefined,
        lte: Number.isFinite(maxPrice) ? maxPrice : undefined,
      },
    },
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(vehicles);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = vehicleSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        title: parsed.data.title,
        price: parsed.data.price,
        brand: parsed.data.brand,
        model: parsed.data.model,
        year: parsed.data.year,
        mileage: parsed.data.mileage,
        location: parsed.data.location,
        description: parsed.data.description,
        status: "PENDING",
        userId: session.user.id,
        images: {
          create: parsed.data.imageUrls.map((imageUrl) => ({ imageUrl })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(
      {
        ...vehicle,
        message: "Your listing request was submitted and is pending admin approval.",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while creating this listing." },
      { status: 500 },
    );
  }
}
