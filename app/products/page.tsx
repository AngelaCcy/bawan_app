"use client";
import ProductLists from "@/components/products/ProductLists";
import FilterBar from "@/components/products/filterBar";

const Products = () => {
  return (
    <div className="flex justify-center w-full px-10">
      <FilterBar />
      <ProductLists />
    </div>
  );
};
export default Products;
