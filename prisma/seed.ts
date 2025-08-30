import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { env } from "../src/config/env";

const prisma = new PrismaClient();

async function seedAdmin() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    await prisma.user.create({
      data: {
        name: env.ADMIN_NAME,
        email: env.ADMIN_EMAIL,
        password: await bcrypt.hash(env.ADMIN_PASSWORD, 10),
        role: "ADMIN",
      },
    });
    console.log("Admin seeded");
  } else {
    console.log("Admin already exists");
  }
  await prisma.$disconnect();
}

seedAdmin();
