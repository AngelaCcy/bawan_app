"use client";

import { useState } from "react";
import ProductIntroSection from "./ProductIntroSection";
import ProductShippingSection from "./ProductShippingSection";
import ProductReviewSection from "./ProductReviewSection";
import { Button } from "../ui/button";

const tabs = ["商品介紹", "送貨及付款方式", "商品評價"];

export default function ProductDetailTabs({
  productId,
}: {
  productId: number;
}) {
  const [activeTab, setAvticeTab] = useState(0);

  return (
    <div className="w-full mt-10 px-4">
      {/* Tab Header */}
      <div className="border-b-2 border-black flex justify-center gap-10 sm:gap-20 md:gap-52">
        {tabs.map((tab, index) => (
          <Button
            key={index}
            variant="ghost"
            className="text-xl font-semibold relative pb-2 transition cursor-pointer"
            onClick={() => setAvticeTab(index)}
          >
            {tab}
            {activeTab === index && (
              <span className="absolute left-0 bottom-0 h-1 w-full bg-[#B08866]" />
            )}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 0 && <ProductIntroSection />}
        {activeTab === 1 && <ProductShippingSection />}
        {activeTab === 2 && <ProductReviewSection productId={productId} />}
      </div>
    </div>
  );
}
