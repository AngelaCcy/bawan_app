"use client";
import ProductLists from "@/components/products/ProductLists";
import FilterBar from "@/components/products/filterBar";
import { useState } from "react";

const Favorites = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([
    0, 0,
  ]);
  const [selectedOther, setSelectedOther] = useState<string[]>([]);

  return (
    <div className="flex justify-center w-full px-10">
      <FilterBar
        selected={selectedBrands}
        onChange={setSelectedBrands}
        onPriceChange={setSelectedPriceRange}
        onOtherChange={setSelectedOther}
        selectedOther={selectedOther}
      />
      <ProductLists
        selectedBrands={selectedBrands}
        selectedPriceRange={selectedPriceRange}
        selectedOther={selectedOther}
      />
    </div>
  );
};
export default Favorites;
