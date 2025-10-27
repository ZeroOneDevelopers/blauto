// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const email = "admin@iliadis.cars";
  const password = "admin123"; // άλλαξέ το μετά το πρώτο login
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      email,
      name: "Admin",
      password: hash,
      role: "ADMIN",
    },
  });

  // --- Προαιρετικό demo όχημα για έλεγχο ---
  await prisma.vehicle.upsert({
    where: { slug: "ferrari-sf90-2023" },
    update: {},
    create: {
      slug: "ferrari-sf90-2023",
      title: "Ferrari SF90 Stradale",
      make: "Ferrari",
      model: "SF90",
      year: 2023,
      price: 530000,
      mileage: 800,
      engine_cc: 3990,
      hp: 1000,
      fuel: "Petrol",
      transmission: "Automatic",
      body: "Coupe",
      color: "Red",
      location: "Athens",
      description: "Hybrid hypercar demo record",
      images: ["/images/sf90-1.jpg", "/images/sf90-2.jpg"],
      audio_urls: ["/sounds/rev1.mp3"],
      featured: true,
    },
  });

  console.log("✅ Seed OK — admin:", email, "(pass:", password + ")");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

