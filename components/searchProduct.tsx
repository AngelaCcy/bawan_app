"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { useProductStore } from "@/app/stores/useProductStore";
import { useEffect } from "react";

export default function SearchProduct() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q")?.toLowerCase() || "";

  const { allProducts, fetchAllProducts, isLoading } = useProductStore();

  useEffect(() => {
    if (allProducts.length === 0) {
      fetchAllProducts();
    }
  }, [fetchAllProducts, allProducts.length]);

  // simple filter
  const filtered = allProducts.filter((product) =>
    product.title.toLowerCase().includes(keyword)
  );

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold mb-4">搜尋結果：「{keyword}」</h1>

      {isLoading ? (
        <p>載入中…</p>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          {keyword ? "找不到符合的商品" : "請輸入關鍵字進行搜尋"}
        </p>
      )}
    </div>
  );
}
