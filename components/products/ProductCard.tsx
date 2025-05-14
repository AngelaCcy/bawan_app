"use client";
import Image from "next/image";
// import { useCartStore } from "@/app/stores/useCartStore";
// import { SaleProduct as Product } from "@/app/utils/fake-data";
import { Product, User } from "@prisma/client";
// import HeartButton from "../HeartButton";
import Link from "next/link";
import { useState } from "react";
import { PriceItem } from "@/app/types/product";
import { isLimitedTime } from "@/app/utils/filtering";

interface Props {
  product: Product & { priceItems: PriceItem[] };
  currentUser?: User | null;
}

// export default function ProductCard({ product, currentUser }: Props) {
export default function ProductCard({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.priceItems[0].size
  );

  const selectedItem = product.priceItems.find(
    (item) => item.size === selectedSize
  );
  const regularPrice = selectedItem?.price ?? 0;
  const now = new Date();
  const activeSale = selectedItem?.salePrices?.find((sp) => {
    const start = new Date(sp.startsAt);
    const end = sp.endsAt ? new Date(sp.endsAt) : undefined;
    return start <= now && (!end || now <= end);
  });

  const salePrice = activeSale?.price;
  // const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="relative hover:-animate-bounce-y bg-[#ECE2D0] rounded-lg shadow-md overflow-hidden hover:shadow-xl flex flex-col justify-between p-4 cursor-pointer">
      <Link href={`/products/${product.id}`} passHref>
        {isLimitedTime(product) && (
          <span className="absolute top-2 right-2 bg-[#9E7C59] text-white text-sm px-4 py-2 rounded-full shadow outline-1 outline-black">
            期間限定
          </span>
        )}
        <Image
          src={`/img/${product.brand}/${product.image[0]}`}
          alt={product.title}
          width={400}
          height={400}
          className="object-cover w-full h-[280px] "
          priority
        />
        <div className="flex-1 flex flex-col justify-between">
          <h2 className="text-lg font-semibold line-clamp-1 my-1.5">
            {product.brand}
          </h2>
          <h2 className="text-lg line-clamp-1">{product.title}</h2>
          <div className="mt-2">
            {product.priceItems.map((item) =>
              item.size != "" ? (
                <button
                  key={item.size}
                  onClick={(e) => {
                    e.preventDefault(); // to prevent Link navigation
                    setSelectedSize(item.size);
                  }}
                  className={`border-black p-1 mr-1.5 mb-1.5 border rounded-sm text-sm cursor-pointer hover:text-[#9E7C59] ${
                    selectedSize === item.size ? "bg-[#D6CCC2]" : "bg-[#EDEDE9]"
                  }`}
                >
                  {item.size}
                </button>
              ) : (
                <div key={item.size} className="p-4 mr-1.5 mb-1.5"></div>
              )
            )}
          </div>
          <div className=" flex items-center justify-between">
            {salePrice ? (
              <div className=" mt-1 flex flex-col">
                <span className="text-red-500 font-semibold">
                  NT ${salePrice}
                  {/* NT ${salePrice.toFixed(2)} */}
                </span>
                <span className="text-gray-800 font-semibold text-sm line-through">
                  NT ${regularPrice}
                  {/* NT ${regularPrice.toFixed(2)} */}
                </span>
              </div>
            ) : (
              <span className="mt-6 text-gray-800 font-semibold">
                NT ${regularPrice}
                {/* NT ${regularPrice.toFixed(2)} */}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
