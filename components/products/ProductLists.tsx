"use client";
import ProductCard from "@/components/products/ProductCard";
// import { FAKE_PRODUCT_DATA as products } from "@/app/utils/fake-data";
import { getProducts } from "@/app/utils/actions";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";

const ProductLists = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const getData = async () => {
      const data = await getProducts();
      if (data) {
        setProducts(data);
      }
      // const currtUser = await getCurrentUser();
      // if (currtUser) {
      //   setCurrentUser(currtUser);
      // }
    };
    getData();
  }, []);

  return (
    <div>
      <div className="">
        <h1 className="text-[25px]">全部商品</h1>
      </div>

      <div className="my-15 mx-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
export default ProductLists;
