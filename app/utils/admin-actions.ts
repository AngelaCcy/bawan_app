"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  importBatchSchema,
  ImportProductInput,
} from "@/lib/validations/product-import";
import { ImportResultSummary } from "@/app/types/product-import";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  return session;
}

/** Returns which of the given vendor SKUs already exist as products. */
export async function findExistingSkus(skus: string[]): Promise<string[]> {
  await requireAdmin();
  const cleaned = [...new Set(skus.filter((s) => s.trim()))];
  if (cleaned.length === 0) return [];
  const existing = await prisma.product.findMany({
    where: { sku: { in: cleaned } },
    select: { sku: true },
  });
  return existing.map((p) => p.sku).filter((s): s is string => s !== null);
}

/**
 * Creates products from one reviewed import batch (max 50 per call — the
 * wizard chunks larger imports). Products whose sku already exists are
 * skipped, which makes re-running a monthly vendor file idempotent.
 */
export async function importProducts(
  products: ImportProductInput[]
): Promise<ImportResultSummary> {
  await requireAdmin();
  const batch = importBatchSchema.parse(products);

  const skus = batch.map((p) => p.sku).filter((s): s is string => !!s);
  const existing = new Set(
    skus.length > 0 ? await findExistingSkus(skus) : []
  );

  const toCreate = batch.filter((p) => !p.sku || !existing.has(p.sku));
  const skipped = batch
    .filter((p) => p.sku && existing.has(p.sku))
    .map((p) => ({ sku: p.sku as string, title: p.title }));

  const result: ImportResultSummary = { created: 0, skipped, failed: [] };
  if (toCreate.length > 0) {
    try {
      await prisma.$transaction(
        toCreate.map((p) =>
          prisma.product.create({
            data: {
              brand: p.brand,
              title: p.title,
              description: p.description,
              category: p.category,
              image: p.image,
              sku: p.sku || null,
              barcode: p.barcode || null,
              isPreorder: p.isPreorder,
              arrivalNote: p.arrivalNote || null,
              totalStock: p.priceItems.reduce((sum, i) => sum + i.stock, 0),
              priceItems: { create: p.priceItems },
            },
          })
        )
      );
      result.created = toCreate.length;
    } catch (error) {
      // Transaction is all-or-nothing: report the whole batch as failed
      const message =
        error instanceof Error ? error.message : "資料庫寫入失敗";
      result.failed = toCreate.map((p) => ({
        sku: p.sku ?? "",
        title: p.title,
        error: message,
      }));
    }
  }

  if (result.created > 0) {
    revalidatePath("/products");
    revalidatePath("/");
  }
  return result;
}
