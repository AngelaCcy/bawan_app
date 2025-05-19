"use client";

import { ProductWithPrice } from "@/app/types/product";
import { getActiveSale } from "@/app/utils/filtering";
import PriceDisplay from "./PriceDisplay";
import SizeSelector from "./SizeSelector";
import { useEffect, useState } from "react";
import AddToCartPanel from "./AddToCartPanel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

      {/* 注意事項 */}
      <div className=" bg-[#D5BDAF] shadow-md max-w-xl">
        <div className="flex justify-center flex-col items-center border-2 border-black px-1 py-4 m-4">
          <p className="pb-1 font-bold">注意⚠️下單前先詢問❗️</p>
          <p>📦 全館滿 NT$599 本島免運</p>
          <p>🚚 現貨商品：1～3 天內寄出</p>
          <p>🕐 預購商品：約 14～21 天到貨</p>
        </div>
      </div>

      {/* Product Ingredients and HOW TO */}
      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg">主要成分</AccordionTrigger>
          <AccordionContent>
            化妝水界的皇后來了 真正的神仙水始祖 這是一款「多功能水狀精華液」
            一瓶含有90%的PITERA
            <br /> ✅有效補水保濕 ✅改善乾燥暗沈 ✅細緻平滑肌膚
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg">用法 & 用途</AccordionTrigger>
          <AccordionContent>
            倒出約50元硬幣用量於手掌心步驟2：再將掌心中的青春露勻潤於雙掌，輕輕擦勻全臉，然後倒出其他用量重複此步驟步驟3：輕拍於全臉，直到完全吸收
            可在化妝水後使用，拍一拍吸收一也可用來濕敷，強化肌膚和保濕💦保濕、透亮、穩定膚況出了名的有感
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
