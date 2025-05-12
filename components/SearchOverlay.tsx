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
import { useState, useEffect } from "react";
import { Product } from "@prisma/client";
import ProductCard from "@/components/products/ProductCard";
import { useProductStore } from "@/app/stores/useProductStore";

export function SearchOverlay() {
  const router = useRouter();
  const { allProducts, fetchAllProducts, isLoading } = useProductStore();
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (allProducts.length === 0) {
      fetchAllProducts();
    }
  }, [fetchAllProducts, allProducts.length]);

  useEffect(() => {
    const keyword = input.trim().toLowerCase();
    const matches = allProducts.filter((p) =>
      p.title.toLowerCase().includes(keyword)
    );
    setFiltered(matches);
  }, [input, allProducts]);

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
      <DialogContent className="sm:max-w-2xl">
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
        <div className="mt-4 max-h-[400px] p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {input.trim() === "" ? (
            <p className="text-sm text-muted-foreground">
              請輸入關鍵字進行搜尋
            </p>
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground">載入中...</p>
          ) : filtered.length > 0 ? (
            filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">找不到相關商品</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
