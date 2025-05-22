"use client";
import Image from "next/image";
import Link from "next/link";
import { ProductWithPrice } from "@/app/types/product";
import { getActiveSale, isLimitedTime } from "@/app/utils/filtering";
import PriceDisplay from "./products/PriceDisplay";

export default function SearchResultCard({
  product,
}: {
  product: ProductWithPrice;
}) {
  const firstItem = product.priceItems[0];
  const sale = getActiveSale(firstItem);

  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-[#ECE2D0] rounded-lg shadow-md overflow-hidden hover:shadow-xl block"
    >
      <div className="relative">
        {isLimitedTime(product) && (
          <span className="absolute top-2 right-2 bg-[#9E7C59] text-white text-xs px-3 py-1 rounded-full shadow">
            期間限定
          </span>
        )}
        <Image
          src={`/img/${product.brand}/${product.image[0]}`}
          alt={product.title}
          width={100}
          height={100}
          className="object-cover w-[100px] h-[100px]"
        />
      </div>
      <div className="p-2">
        <p className="text-sm font-semibold line-clamp-1">{product.brand}</p>
        <p className="text-sm line-clamp-1">{product.title}</p>
        <PriceDisplay regularPrice={firstItem.price} salePrice={sale?.price} />
      </div>
    </Link>
  );
}
