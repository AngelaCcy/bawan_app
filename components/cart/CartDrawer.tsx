"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/app/stores/useCartStore";
import CartItem from "./CartItem";
import { Button } from "../ui/button";

export default function CartDrawer() {
  const cart = useCartStore((s) => s.cart);
  const total = useCartStore((s) => s.totalPrice);

  return (
    <Sheet>
      <SheetTrigger className="relative">
        <ShoppingBag className="nav-icon" />
        {cart.length > 0 && (
          <span className="absolute -top-0.5 -right-[0.05px] w-4 h-4 rounderd-full bg-[#9E7C59] text-white text-xs rounded-full px-1.5">
            {cart.length}
          </span>
        )}
      </SheetTrigger>

      <SheetContent side="right" className=" w-[360px] bg-[#e7ded3] px-6 py-6">
        <SheetHeader className="border-b-2 border-black mb-4">
          <SheetTitle className="text-xl font-bold">購物車</SheetTitle>
        </SheetHeader>

        {/* Cart Item */}
        {cart.length === 0 ? (
          <div className="flex justify-center w-full h-full items-center text-center">
            <p className="text-sm text-gray-500">購物車是空的</p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <CartItem key={`${item.productId}_${item.size}`} item={item} />
            ))}
          </>
        )}

        {/* Total Price */}
        <div className="m-3 absolute bottom-0 w-[290px]">
          <p className="pb-2">購物車小計: NT ${total}</p>
          <Button variant="custom" className="w-full">
            查看購物車
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
