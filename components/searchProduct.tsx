"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { useSearchProducts } from "@/app/stores/useSearchProducts";
import { useEffect } from "react";

export default function SearchProduct() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q")?.toLowerCase() || "";

  const { filtered: products, loading, total } = useSearchProducts(keyword);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [keyword]);

  // useEffect(() => {
  //   if (allProducts.length === 0) {
  //     fetchAllProducts();
  //   }
  // }, [fetchAllProducts, allProducts.length]);

  // // simple filter
  // const filtered = allProducts.filter((product) =>
  //   product.title.toLowerCase().includes(keyword)
  // );

  return (
    <div className="px-4 py-6 mt-24">
      <h1 className="text-xl font-bold mb-4">搜尋結果：「{keyword}」</h1>

      {products.length > 0 && !loading && (
        <h2 className="text-sm text-muted-foreground mb-4">
          共找到 {total} 筆與「{keyword}」相關的商品
        </h2>
      )}

      {loading ? (
        <p>載入中…</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <div
              key={product.id}
              data-aos="fade-up"
              data-aos-delay={`${(idx % 4) * 100}`} // 0,100,200,300ms 循環
              data-aos-anchor-placement="top-bottom"
            >
              <ProductCard product={product} />
            </div>
          ))}
          {/* {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))} */}
        </div>
      ) : (
        <p className="text-muted-foreground">
          {keyword ? "找不到符合的商品" : "請輸入關鍵字進行搜尋"}
        </p>
      )}
    </div>
  );
}
