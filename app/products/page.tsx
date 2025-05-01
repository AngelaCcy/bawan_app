"use client";
import ProductLists from "@/components/products/ProductLists";
import FilterBar from "@/components/filterBar";

const Products = () => {
  return (
    <div className="flex justify-between w-full px-10">
      <FilterBar />
      <ProductLists />
    </div>
  );
};
export default Products;
