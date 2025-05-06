"use client";
import ProductCard from "@/components/products/ProductCard";
// import { FAKE_PRODUCT_DATA as products } from "@/app/utils/fake-data";
import { getProducts } from "@/app/utils/actions";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Direction } from "@/app/utils/fake-data";
import { PriceMap } from "@/app/utils/fake-data";

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

  // const [direction, setDirection] = useState<Direction>("ASC");
  const getMinPrice = (product: Product): number => {
    const priceMap = product.priceBySize as PriceMap;
    return Math.min(...Object.values(priceMap));
  };
  const handleSortingDirectionChange = (value: string) => {
    // setDirection(value as Direction);

    const sorted = [...products];

    switch (value) {
      case "ASC":
        sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
        break;
      case "DES":
        sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a));
        break;
      case "newest":
        sorted.sort((a, b) => b.id - a.id); // assuming higher ID = newer
        break;
      case "oldest":
        sorted.sort((a, b) => a.id - b.id);
        break;
    }

    setProducts(sorted);
  };

  return (
    <div>
      <div className="flex justify-between flex-col sm:flex-row">
        <div>
          <h1 className="text-[25px] pb-2">全部商品</h1>
        </div>
        <Select onValueChange={handleSortingDirectionChange}>
          <SelectTrigger className="w-[180px] border-2 bg-[#9E7C59] text-white">
            <SelectValue placeholder="商品排序" className="text-white" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASC">價錢：由低至高</SelectItem>
            <SelectItem value="DES">價錢：由高至低</SelectItem>
            <SelectItem value="newest">上架時間：由新到舊</SelectItem>
            <SelectItem value="oldest">上架時間：由舊到新</SelectItem>
          </SelectContent>
        </Select>
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
