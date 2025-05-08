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
