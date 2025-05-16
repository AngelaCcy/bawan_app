import { PriceItem } from "@/app/types/product";

export function getActiveSale(item: PriceItem) {
  const now = new Date();
  return item.salePrices?.find((sp) => {
    const start = new Date(sp.startsAt);
    const end = sp.endsAt ? new Date(sp.endsAt) : undefined;
    return start <= now && (!end || now <= end);
  });
}

export function getActivePrice(item: PriceItem): number {
  // const now = new Date();
  const activeSale = getActiveSale(item);
  // const activeSale = item.salePrices?.find((sp) => {
  //   const start = new Date(sp.startsAt);
  //   const end = sp.endsAt ? new Date(sp.endsAt) : undefined;
  //   return start <= now && (!end || now <= end);
  // });

  return activeSale?.price ?? item.price;
}

//只要這個商品有設定「開始販售日期」或「結束販售日期」，就代表它是期間限定。
export function isLimitedTime(product: {
  availableFrom?: Date | null;
  availableUntil?: Date | null;
}): boolean {
  // const now = new Date();
  // const from = product.availableFrom ? product.availableFrom : null;
  // const until = product.availableUntil
  //   ? new Date(product.availableUntil)
  //   : null;

  // return (
  //   (!product.availableFrom || product.availableFrom <= now) &&
  //   (!product.availableUntil || now <= product.availableUntil)
  // );
  return Boolean(product.availableFrom || product.availableUntil);
}
