import { Product } from "@prisma/client";

export interface SalePrice {
  id: number;
  price: number;
  startsAt: Date;
  endsAt?: Date | null;
  priceItemId: number;
}

export interface PriceItem {
  id: number;
  size: string;
  price: number;
  productId: number;
  salePrices: SalePrice[];
}

export type ProductWithPrice = Product & {
  priceItems: PriceItem[];
};
