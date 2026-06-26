import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "angela910914@gmail.com" },
    update: { role: "ADMIN" },
    create: {
      email: "angela910914@gmail.com",
      name: "Angela",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin set: ${admin.email} (${admin.role})`);

  const products = await prisma.product.findMany({ take: 3 });
  if (products.length === 0) {
    console.log("⚠️  No products found — skipping fake order seed");
    return;
  }

  const statuses: OrderStatus[] = [
    "DELIVERED",
    "SHIPPED",
    "PROCESSING",
    "PENDING",
    "CANCELLED",
  ];

  for (let i = 0; i < 5; i++) {
    const product = products[i % products.length];
    const status = statuses[i];
    const qty = Math.floor(Math.random() * 3) + 1;
    const price = 980 + i * 200;

    await prisma.order.create({
      data: {
        userId: admin.id,
        status,
        total: qty * price,
        createdAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
        items: {
          create: {
            productId: product.id,
            name: product.title,
            brand: product.brand,
            size: "50ml",
            qty,
            price,
            image: product.image[0] ?? "",
          },
        },
      },
    });
  }
  console.log(`✅ Seeded 5 fake orders for ${admin.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
