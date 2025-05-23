"use client";

import { useSearchParams } from "next/navigation";
// import ProductCard from "@/components/products/ProductCard";
import { useSearchProducts } from "@/app/stores/useSearchProducts";
import { useEffect } from "react";
import SearchResultCard from "./SearchResultCard";
import AOS from "aos";

export default function SearchProduct() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q")?.toLowerCase() || "";

  const { filtered: products, loading, total } = useSearchProducts(keyword);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [keyword]);

  // 每次資料更新時，讓 AOS 重新偵測新元素
  useEffect(() => {
    AOS.refresh();
  }, [products]);

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product, idx) => {
            const delay = (idx % 5) * 100;
            return (
              <div
                key={product.id}
                data-aos="fade-up"
                data-aos-delay={delay} // 0,100,200,300ms 循環
                data-aos-anchor-placement="top-bottom"
                data-aos-duration="500"
              >
                {/* <ProductCard product={product} /> */}
                <SearchResultCard product={product} />
              </div>
            );
          })}
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
