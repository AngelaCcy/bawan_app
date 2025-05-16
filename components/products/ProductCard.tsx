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
}

// export default function ProductCard({ product, currentUser }: Props) {
export default function ProductCard({ product }: Props) {
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
  console.log(
    "Sizes:",
    product.priceItems.map((item) => item.size)
  );
  console.log("Product:", product);

  return (
    <div className="relative hover:-animate-bounce-y bg-[#ECE2D0] rounded-lg shadow-md overflow-hidden hover:shadow-xl flex flex-col justify-between p-4 cursor-pointer">
      <Link href={`/products/${product.id}`} passHref>
        {isLimitedTime(product) && (
          <span className="absolute top-2 right-2 bg-[#9E7C59] text-white text-sm px-4 py-2 rounded-full shadow outline-1 outline-black">
            期間限定
          </span>
        )}

        {/* Product Image */}
        <Image
          src={`/img/${product.brand}/${product.image[0]}`}
          alt={product.title}
          width={400}
          height={400}
          className="object-cover w-full h-[280px] "
          priority
        />

        {/* Info Section */}
        <div className="flex-1 flex flex-col justify-between">
          <h2 className="text-lg font-semibold line-clamp-1 my-1.5">
            {product.brand}
          </h2>
          <h2 className="text-lg line-clamp-1">{product.title}</h2>

          {/* Size Selector */}
          <SizeSelector
            sizes={product.priceItems.map((item) => item.size)}
            disabledSizes={product.priceItems
              .filter((item) => item.stock === 0)
              .map((item) => item.size)}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
          {/* <div className="mt-2">
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
          </div> */}

          {/* Price Section */}
          {/* <div className=" flex items-center justify-between"> */}
          <PriceDisplay
            regularPrice={selectedItem.price}
            salePrice={activeSale?.price}
          />
          {/* {salePrice ? (
              <div className=" mt-1 flex flex-col">
                <span className="text-red-500 font-semibold">
                  NT ${salePrice}
                  {/* NT ${salePrice.toFixed(2)} */}
          {/* </span>
                <span className="text-gray-800 font-semibold text-sm line-through">
                  NT ${regularPrice}
                  {/* NT ${regularPrice.toFixed(2)} */}
          {/* </span> */}
          {/* </div> */}
          {/* ) : ( */}
          {/* <span className="mt-6 text-gray-800 font-semibold"> */}
          {/* NT ${regularPrice} */}
          {/* NT ${regularPrice.toFixed(2)} */}
          {/* </span> */}
          {/* )} */}
          {/* </div> */}
        </div>
      </Link>
    </div>
  );
}
