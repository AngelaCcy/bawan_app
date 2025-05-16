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
  stock: number;
}

export type ProductWithPrice = Product & {
  priceItems: PriceItem[];
};

export interface CartItem {
  productId: number;
  title: string;
  brand: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}
