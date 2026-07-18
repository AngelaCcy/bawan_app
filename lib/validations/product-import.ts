import { z } from "zod";

// Shared between the preview step (client) and importProducts (server).
// The server re-parses every batch — never trusts client-side validation.

export const importPriceItemSchema = z.object({
  size: z.string().trim().min(1, "尺寸為必填"),
  price: z
    .number()
    .int("價格需為整數")
    .positive("價格需大於 0"),
  stock: z.number().int("庫存需為整數").min(0, "庫存不可為負數"),
});

export const importProductSchema = z.object({
  sku: z.string().trim().min(1).optional(),
  barcode: z.string().trim().optional(),
  brand: z.string().trim().min(1, "品牌為必填"),
  title: z.string().trim().min(1, "品名為必填"),
  description: z.string().default(""),
  category: z.string().trim().min(1, "分類為必填"),
  image: z.array(z.string().trim().min(1)).default([]),
  isPreorder: z.boolean().default(false),
  arrivalNote: z.string().trim().optional(),
  priceItems: z.array(importPriceItemSchema).min(1, "至少需要一個價格項目"),
});

export type ImportProductInput = z.infer<typeof importProductSchema>;

/** Server-side batch limit — the client sends products in chunks of this size. */
export const IMPORT_BATCH_SIZE = 50;

export const importBatchSchema = z
  .array(importProductSchema)
  .min(1)
  .max(IMPORT_BATCH_SIZE);
