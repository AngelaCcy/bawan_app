import { useEffect, useState } from "react";
import { ProductWithPrice } from "@/app/types/product";
import { searchProductsWithCount } from "@/app/utils/actions";

export function useInfiniteSearchProducts(keyword: string, pageSize = 8) {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  // Reset state on keyword change
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setTotal(0);
  }, [keyword]);

  useEffect(() => {
    const load = async () => {
      if (!keyword.trim()) return;

      setLoading(true);
      const { products: result, totalCount } = await searchProductsWithCount(
        keyword,
        page,
        pageSize
      );
      setProducts((prev) => {
        const combined = [...prev, ...result];
        const unique = Array.from(
          new Map(combined.map((p) => [p.id, p])).values()
        );
        return unique;
      });
      setHasMore(result.length === pageSize); // if less, no more pages
      setTotal(totalCount);
      setLoading(false);
    };

    load();
  }, [keyword, page, pageSize]);

  return {
    products,
    loading,
    hasMore,
    total,
    loadMore: () => setPage((prev) => prev + 1),
  };
}
