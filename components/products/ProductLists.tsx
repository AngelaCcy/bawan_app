"use client";
import ProductCard from "@/components/products/ProductCard";
import { FAKE_PRODUCT_DATA as products } from "@/app/utils/fake-data";

const ProductLists = () => {
  return (
    <div>
      <div className="my-25 mx-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
export default ProductLists;
