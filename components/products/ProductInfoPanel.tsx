"use client";

import { ProductWithPrice } from "@/app/types/product";
import { getActiveSale } from "@/app/utils/filtering";
import PriceDisplay from "./PriceDisplay";
import SizeSelector from "./SizeSelector";
import { useEffect, useState } from "react";
import AddToCartPanel from "./AddToCartPanel";

interface Props {
  product: ProductWithPrice;
}

export default function ProductInfoPanel({ product }: Props) {
  console.log("Product Info Panel received:", product);

  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (product.priceItems.length > 0) {
      setSelectedSize(product.priceItems[0].size);
    }
  }, [product]);

  if (!selectedSize) return null;

  const selectedItem = product.priceItems.find(
    (item) => item.size === selectedSize
  );

  const activeSale = selectedItem ? getActiveSale(selectedItem) : null;

  const allOutOfStock = product.priceItems.every((item) => item.stock === 0);
  const isSelectedOutOfStock = selectedItem?.stock === 0;
  const isLowStock =
    selectedItem && selectedItem.stock > 0 && selectedItem.stock <= 5;

  return (
    <div className="flex flex-col justify-start space-y-4">
      <h1 className="text-4xl font-semibold">{product.brand}</h1>
      <h2 className="text-2xl">{product.title}</h2>
      <span className="text-gray-500 text-[18px]">#再創新低價 #專櫃正品</span>

      <SizeSelector
        sizes={product.priceItems.map((item) => item.size)}
        disabledSizes={product.priceItems
          .filter((item) => item.stock === 0)
          .map((item) => item.size)}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      />

      {/* Display Price */}
      {selectedItem && (
        <PriceDisplay
          regularPrice={selectedItem.price}
          salePrice={activeSale?.price}
        />
      )}

      {/* Add to Cart */}
      {selectedItem && (
        <AddToCartPanel
          productId={product.id}
          title={product.title}
          brand={product.brand}
          size={selectedItem.size}
          stock={selectedItem.stock}
          price={activeSale?.price ?? selectedItem.price}
          image={product.image[0]}
        />
      )}
      {/* Insert stock alert here */}
      <div className="flex justify-center">
        {allOutOfStock ? (
          <p className="text-sm text-red-600 font-medium">
            ⚠️ 此商品所有容量皆已售完
          </p>
        ) : isSelectedOutOfStock ? (
          <p className="text-sm text-red-600 font-medium">此容量已售完</p>
        ) : isLowStock ? (
          <p className="text-sm text-orange-500 font-medium">
            僅剩 {selectedItem.stock} 件！
          </p>
        ) : null}
      </div>
    </div>
  );
}
