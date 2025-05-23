"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
// import { useProductStore } from "@/hooks/useProductStore";
import { useEffect, useRef, useCallback } from "react";
import { useInfiniteSearchProducts } from "@/app/stores/useInfiniteSearchProducts";
// import { searchProducts } from "@/app/utils/actions";
// import { ProductWithPrice } from "@/app/types/product";

export default function SearchProduct() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q")?.toLowerCase() || "";

  const { products, loading, hasMore, loadMore, total } =
    useInfiniteSearchProducts(keyword);

  // const { allProducts, fetchAllProducts, isLoading } = useProductStore();

  // useEffect(() => {
  //   if (allProducts.length === 0) {
  //     fetchAllProducts();
  //   }
  // }, [fetchAllProducts, allProducts.length]);

  // simple filter
  // const filtered = allProducts.filter((product) =>
  //   product.title.toLowerCase().includes(keyword)
  // );

  // const [products, setProducts] = useState<ProductWithPrice[]>([]);
  // const [page, setPage] = useState(1);
  // const pageSize = 12;
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const loadProducts = async () => {
  //     setLoading(true);
  //     const data = await searchProducts(keyword, page, pageSize);
  //     // setProducts(data);
  //     setProducts((prev) => [...prev, ...data]);

  //     setLoading(false);
  //   };

  //   if (keyword) {
  //     loadProducts();
  //   }
  // }, [keyword, page]);

  // // Reset search state hwen the user searches a new keyword
  // useEffect(() => {
  //   setPage(1);
  //   setProducts([]); // clear old results
  // }, [keyword]);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [keyword]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      console.log("🧠 isIntersecting:", target.isIntersecting);
      if (
        target.isIntersecting &&
        hasMore &&
        !loading &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true;
        loadMore();
        setTimeout(() => {
          isFetchingRef.current = false;
        }, 300);
      }
    },
    [hasMore, loadMore, loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold mb-4">搜尋結果：「{keyword}」</h1>

      {products.length > 0 && !loading && (
        <h2 className="text-sm text-muted-foreground mb-4">
          共找到 {total} 筆與「{keyword}」相關的商品
        </h2>
      )}

      {/* {loading ? (
        <p>載入中…</p>
      ) : products.length > 0 ? ( */}
      {products.length === 0 && !loading ? (
        <p className="text-muted-foreground">
          {keyword ? "找不到符合的商品" : "請輸入關鍵字進行搜尋"}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
              // <SearchResultCard key={product.id} product={product} />
            ))}
          </div>
          {/* ) : (
        <p className="text-muted-foreground">
          {keyword ? "找不到符合的商品" : "請輸入關鍵字進行搜尋"}
        </p>
      )} */}
          <div ref={loaderRef} className="h-8 mt-20" />

          {loading && (
            <p className="text-center text-muted-foreground mt-4">載入中...</p>
          )}
        </>
      )}
    </div>
  );
}
