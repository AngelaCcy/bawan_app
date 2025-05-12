import { PriceItem } from "@/app/types/product";

export function getActivePrice(item: PriceItem): number {
  const now = new Date();
  const activeSale = item.salePrices?.find((sp) => {
    const start = new Date(sp.startsAt);
    const end = sp.endsAt ? new Date(sp.endsAt) : undefined;
    return start <= now && (!end || now <= end);
  });

  return activeSale?.price ?? item.price;
}

export function isLimitedTime(product: {
  availableFrom?: string;
  availableUntil?: string;
}): boolean {
  const now = new Date();
  const from = product.availableFrom ? new Date(product.availableFrom) : null;
  const until = product.availableUntil
    ? new Date(product.availableUntil)
    : null;

  return (!from || from <= now) && (!until || now <= until);
}
