"use client";
import ProductLists from "@/components/products/ProductLists";
import FilterBar from "@/components/products/filterBar";
import { useState } from "react";

const Products = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([
    0, 0,
  ]);

  return (
    <div className="flex justify-center w-full px-10">
      <FilterBar
        selected={selectedBrands}
        onChange={setSelectedBrands}
        onPriceChange={setSelectedPriceRange}
      />
      <ProductLists
        selectedBrands={selectedBrands}
        selectedPriceRange={selectedPriceRange}
      />
    </div>
  );
};
export default Products;
