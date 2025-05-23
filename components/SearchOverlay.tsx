"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { ProductWithPrice } from "@/app/types/product";
import ProductCard from "@/components/products/ProductCard";
// import SearchResultCard from "./SearchResultCard";
import { useSearchProducts } from "@/app/stores/useSearchProducts";

export function SearchOverlay() {
  const router = useRouter();
  const [input, setInput] = useState("");
  // const [filtered, setFiltered] = useState<ProductWithPrice[]>([]);
  const [open, setOpen] = useState(false);
  const { filtered, loading } = useSearchProducts(input);

  // useEffect(() => {
  //   if (allProducts.length === 0) {
  //     fetchAllProductsForSearch();
  //   }
  // }, [fetchAllProductsForSearch, allProducts.length]);

  // useEffect(() => {
  //   const keyword = input.trim().toLowerCase();
  //   const matches = allProducts.filter((p) =>
  //     p.title.toLowerCase().includes(keyword)
  //   );
  //   setFiltered(matches);
  // }, [input, allProducts]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(input.trim())}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setOpen(true)}>
          <Search className="nav-icon" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogTitle className="text-lg font-semibold mb-2">
          搜尋商品
        </DialogTitle>

        <Input
          type="text"
          placeholder="輸入商品名稱..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {/* <div className="mt-4 max-h-[500px] p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> */}
        <div className="mt-4 max-h-[500px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {input.trim() === "" ? (
            <p className="text-sm text-muted-foreground">
              請輸入關鍵字進行搜尋
            </p>
          ) : loading ? (
            <p className="text-sm text-muted-foreground">載入中...</p>
          ) : filtered.length > 0 ? (
            filtered.map((product) => (
              <div
                key={product.id}
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
              >
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="search"
                  onClick={() => setOpen(false)}
                />
              </div>
            ))
          ) : (
            // filtered.map((product) => (
            //   <ProductCard
            //     key={product.id}
            //     product={product}
            //     variant="search"
            //     onClick={() => setOpen(false)}
            //   />
            // ))
            <p className="text-sm text-muted-foreground">找不到相關商品</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
