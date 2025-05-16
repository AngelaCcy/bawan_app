"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/app/stores/useCartStore";
import { Button } from "../ui/button";
import QuantityController from "../QuantityController";

interface AddToCartProps {
  productId: number;
  title: string;
  brand: string;
  size: string;
  price: number;
  image: string;
  stock: number;
}

export default function AddToCartPanel({
  productId,
  title,
  brand,
  size,
  stock,
  price,
  image,
}: AddToCartProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((s) => s.cart);

  const existingItem = cart.find(
    (item) => item.productId === productId && item.size === size
  );
  const cartQty = existingItem?.quantity ?? 0;
  const maxQuantity = Math.max(stock - cartQty, 0);
  // const reachedMax = quantity + cartQty > stock;
  const reachedMax = quantity >= maxQuantity;
  const disableAddButton = quantity === 0 || maxQuantity === 0;

  // 限制 quantity 預設不可超過剩餘數量
  useEffect(() => {
    setQuantity(Math.min(1, maxQuantity));
  }, [maxQuantity]);

  const handleAdd = () => {
    // if (reachedMax || maxQuantity === 0) return;
    if (disableAddButton) return;
    addToCart({
      productId,
      title,
      brand,
      size,
      quantity,
      price,
      image,
      stock,
    });
    setQuantity(1); //Reset quantity after adding
  };

  if (stock === 0) {
    return (
      <Button disabled className="w-full bg-gray-300 text-gray-600">
        補貨通知我
      </Button>
    );
  }

  return (
    <div className="space-y-3 flex flex-col justify-center items-center">
      {/* <QuantityController
        quantity={quantity}
        onIncrease={() => setQuantity(Math.min(quantity + 1, stock))}
        onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
        disableIncrease={quantity >= stock}
        disableDecrease={quantity <= 1}
      /> */}
      <QuantityController
        quantity={quantity}
        onIncrease={() => setQuantity(Math.min(quantity + 1, maxQuantity))}
        onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
        disableIncrease={reachedMax}
        disableDecrease={quantity <= 1}
      />

      {/* Stock alert */}
      {reachedMax && (
        <p className="text-sm text-red-500 mt-1">
          已加入最大數量 （目前購物車已有 {cartQty} 件）
        </p>
      )}
      {/* <div className="flex items-center w-fit text-lg font-semibold">
        <Button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          variant="quantityBtn"
          className="w-10 h-10 p-0"
        >
          -
        </Button>
        <span className="px-4">{quantity}</span>
        <Button
          onClick={() => setQuantity(Math.min(quantity + 1, stock))}
          variant="quantityBtn"
          className="w-10 h-10 p-0"
        >
          +
        </Button>
      </div> */}

      <Button
        onClick={handleAdd}
        disabled={disableAddButton}
        className="w-full bg-[#9E7C59] text-white hover:bg-[#8a6c4f] mr-2"
      >
        加入購物車
      </Button>
    </div>
  );
}
