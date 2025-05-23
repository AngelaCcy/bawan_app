"use client";
import ProductCard from "@/components/products/ProductCard";
// import { FAKE_PRODUCT_DATA as products } from "@/app/utils/fake-data";
import { useEffect, useState } from "react";
// import { Product } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Direction } from "@/app/utils/fake-data";
import { useProductStore } from "@/hooks/useProductStore";
import { ProductWithPrice } from "@/app/types/product";
import { getActivePrice } from "@/app/utils/filtering";

type Props = {
  selectedBrands: string[];
  selectedPriceRange: number[];
  selectedOther: string[];
};

export default function ProductLists({
  selectedBrands,
  selectedPriceRange,
  selectedOther,
}: Props) {
  const { allProducts, fetchAllProducts, isLoading } = useProductStore();
  const [filtered, setFiltered] = useState<ProductWithPrice[]>([]);
  const [sortKey, setSortKey] = useState<string>("newest");

  //Initial get all products
  useEffect(() => {
    if (allProducts.length === 0) {
      fetchAllProducts();
    }
  }, [fetchAllProducts, allProducts.length]);

  useEffect(() => {
    // let result = [...allProducts];
    let result = allProducts as ProductWithPrice[];

    // filter by brand
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // filter by price range using priceItems[0] (default size)
    // const now = new Date();
    result = result.filter((product) => {
      const first = product.priceItems[0];
      if (!first) return false;

      const price = getActivePrice(first);
      return price >= selectedPriceRange[0] && price <= selectedPriceRange[1];
    });

    // filter by 'sale' option
    if (selectedOther.includes("sale")) {
      result = result.filter((product) => {
        const first = product.priceItems[0];
        if (!first) return false;
        return getActivePrice(first) < first.price;
      });
    }

    // filter by 'limitedTime' option (example: sale endsAt must exist and be soon)
    if (selectedOther.includes("limitedTime")) {
      result = result.filter(
        (product) => product.availableFrom || product.availableUntil
      );
    }

    // sorting
    const getPriceForSort = (product: ProductWithPrice): number => {
      const first = product.priceItems[0];
      if (!first) return Infinity;

      return getActivePrice(first);
    };

    switch (sortKey) {
      case "ASC":
        result.sort((a, b) => getPriceForSort(a) - getPriceForSort(b));
        break;
      case "DES":
        result.sort((a, b) => getPriceForSort(b) - getPriceForSort(a));
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        result.sort((a, b) => a.id - b.id);
        break;
    }

    setFiltered(result);
  }, [selectedBrands, selectedPriceRange, sortKey, allProducts, selectedOther]);

  const handleSortingDirectionChange = (value: string) => {
    setSortKey(value);
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
      {isLoading ? (
        <div className="flex justify-center mt-40 w-[945px] h-[495px]">
          <p className="text-muted-foreground">載入中...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className=" my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="lg:w-[945px] h-[495px] md:w-[500px] sm:w-[200px] flex justify-center items-cente mt-40">
          <p className="">沒有符合的產品</p>
        </div>
      )}
    </div>
  );
}
