import Image from "next/image";
// import { useCartStore } from "@/app/stores/useCartStore";
// import { SaleProduct as Product } from "@/app/utils/fake-data";
import { Product } from "@prisma/client";
// import HeartButton from "../HeartButton";
import { User } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { PriceMap } from "@/app/utils/fake-data";

interface Props {
  product: Product;
  currentUser?: User | null;
}

// export default function ProductCard({ product, currentUser }: Props) {
export default function ProductCard({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const priceBySize = product.priceBySize as PriceMap;
  const salePriceBySize = product.salePriceBySize as PriceMap | undefined;

  const regularPrice = priceBySize[selectedSize];
  const salePrice = salePriceBySize?.[selectedSize];
  // const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="hover:-animate-bounce-y bg-[#ECE2D0] rounded-lg shadow-md overflow-hidden hover:shadow-xl flex flex-col justify-between p-4 relative cursor-pointer">
      <Link href={`/products/${product.id}`} passHref>
        <Image
          src={product.image[0]}
          alt={product.title}
          width={400}
          height={400}
          className="object-cover w-full h-[180px] "
          priority
        />
        <div className="flex-1 flex flex-col justify-between">
          <h2 className="text-lg font-semibold line-clamp-1 my-1.5">
            {product.brand}
          </h2>
          <h2 className="text-lg line-clamp-1">{product.title}</h2>
          <div className="mt-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault(); // to prevent Link navigation
                  setSelectedSize(size);
                }}
                className={`border-black p-1 mr-1.5 border rounded-sm text-sm cursor-pointer hover:text-[#9E7C59] ${
                  selectedSize === size ? "bg-[#D6CCC2]" : "bg-[#EDEDE9]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            {salePrice ? (
              <div className="flex flex-col">
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
              <span className="text-gray-800 font-semibold">
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
