import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(64),
  adminInviteCode: z.string().min(6).max(128).optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = registerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid registration data." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
    const providedAdminCode = parsed.data.adminInviteCode?.trim();
    const configuredAdminCode = process.env.ADMIN_INVITE_CODE?.trim();

    if (providedAdminCode && (!configuredAdminCode || providedAdminCode !== configuredAdminCode)) {
      return NextResponse.json(
        { error: "Invalid admin invite code." },
        { status: 403 },
      );
    }

    const role = providedAdminCode ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while creating your account." },
      { status: 500 },
    );
  }
}
