import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adminName = process.env.ADMIN_NAME ?? "AURA Admin";
const adminEmail = process.env.ADMIN_EMAIL ?? "admin@aura.local";
const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";

async function main() {
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log("Admin account ready:");
  console.log(`email=${adminUser.email}`);
  console.log(`role=${adminUser.role}`);

  if (!process.env.ADMIN_PASSWORD) {
    console.log("password=Admin@12345");
    console.log("Set ADMIN_PASSWORD env var to override this default.");
  }
}

main()
  .catch((error) => {
    console.error("Failed to create admin account.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
