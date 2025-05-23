import { useState, useEffect } from "react";
import { getAllProducts } from "../utils/actions";
import { ProductWithPrice } from "../types/product";

export function useSearchProducts(input: string) {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const all = await getAllProducts();
      setProducts(all);
      setLoading(false);
    };

    load();
  }, []);

  const keyword = input.trim().toLowerCase();
  const filtered = products.filter((p) => {
    // Combine title and brand into one string
    const text = `${p.title} ${p.brand}`.toLowerCase();
    return text.includes(keyword);
  });

  return { filtered, loading };
}
