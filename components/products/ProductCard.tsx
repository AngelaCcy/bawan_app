"use client";
import Image from "next/image";
// import { useCartStore } from "@/app/stores/useCartStore";
// import { SaleProduct as Product } from "@/app/utils/fake-data";
import { User } from "@prisma/client";
// import HeartButton from "../HeartButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductWithPrice } from "@/app/types/product";
import { getActiveSale, isLimitedTime } from "@/app/utils/filtering";
import PriceDisplay from "./PriceDisplay";
import SizeSelector from "./SizeSelector";

interface Props {
  product: ProductWithPrice;
  currentUser?: User | null;
  variant?: "default" | "search";
  onClick?: () => void;
}

// export default function ProductCard({ product, currentUser }: Props) {
export default function ProductCard({
  product,
  variant = "default",
  onClick,
}: Props) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (product.priceItems.length > 0) {
      setSelectedSize(product.priceItems[0].size);
    }
  }, [product.priceItems]);

  const selectedItem = product.priceItems.find(
    (item) => item.size === selectedSize
  );
  if (!selectedItem) return null;

  const activeSale = getActiveSale(selectedItem);
  // const regularPrice = selectedItem?.price ?? 0;
  // const activeSale = getActiveSale(selectedItem);

  // const salePrice = activeSale?.price;
  // const addToCart = useCartStore((state) => state.addToCart);

  // shared styles
  const containerBase =
    "bg-[#ECE2D0] rounded-lg shadow-md overflow-hidden hover:shadow-xl cursor-pointer";
  const isSearch = variant === "search";

  return (
    // <div className="relative hover:-animate-bounce-y bg-[#ECE2D0] rounded-lg shadow-md overflow-hidden hover:shadow-xl flex flex-col justify-between p-4 cursor-pointer">
    <Link
      href={`/products/${product.id}`}
      passHref
      onClick={onClick}
      className={`${containerBase} ${
        isSearch
          ? "flex flex-col p-3 h-[350px]"
          : "flex flex-col justify-between p-4 h-[480px] hover:-animate-bounce-y"
      }`}
    >
      <div
        className={` relative ${
          isSearch ? "ml-6 w-[150px] h-[300px]" : "w-full h-[320px]"
        } overflow-hidden`}
      >
        {isLimitedTime(product) && (
          <span className="absolute top-2 right-2 bg-[#9E7C59] text-white text-sm px-4 py-2 rounded-full shadow outline-1 outline-black">
            期間限定
          </span>
        )}

        {/* Product Image */}
        {isSearch ? (
          <Image
            src={`/img/${product.brand}/${product.image[0]}`}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <Image
            src={`/img/${product.brand}/${product.image[0]}`}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Info Section */}
      {/* <div className="flex-1 flex flex-col justify-between"> */}
      {/* <div className={`p-3 ${isSearch ? "flex-1 flex flex-col" : ""}`}> */}
      <div className={`p-3 ${activeSale ? "pt-0 pb-0" : ""}`}>
        <h2 className="text-lg font-semibold line-clamp-1 my-1.5">
          {product.brand}
        </h2>
        <h2 className="text-lg line-clamp-1">{product.title}</h2>

        {/* Size Selector */}
        {/* 只有 default 顯示 SizeSelector */}
        {!isSearch && (
          <SizeSelector
            sizes={product.priceItems.map((item) => item.size)}
            disabledSizes={product.priceItems
              .filter((item) => item.stock === 0)
              .map((item) => item.size)}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
        )}

        <PriceDisplay
          regularPrice={selectedItem.price}
          salePrice={activeSale?.price}
        />
      </div>
    </Link>
    // </div>
  );
}
