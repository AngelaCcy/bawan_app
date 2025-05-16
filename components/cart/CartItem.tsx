import { useCartStore } from "@/app/stores/useCartStore";
import { CartItem as CartItemType } from "@/app/types/product";
import Image from "next/image";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import QuantityController from "../QuantityController";

export default function CartItem({ item }: { item: CartItemType }) {
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  return (
    <div
      key={`${item.productId}-${item.size}`}
      className="flex items-start gap-8 mb-4 border-b-1 pb-5 border-black"
    >
      <Image
        src={`/img/${item.brand}/${item.image}`}
        alt={item.title}
        width={400}
        height={400}
        className="w-30 h-30 object-cover"
      />
      <div className="flex-1">
        <p className="font-bold leading-none pb-1">{item.brand}</p>
        <p className="text-sm pb-1">{item.title}</p>
        <p className="text-sm text-muted-foreground pb-1">{item.size}</p>
        {/* <p>數量：{item.quantity}</p> */}
        <QuantityController
          quantity={item.quantity}
          onIncrease={() =>
            updateQuantity(item.productId, item.size, item.quantity + 1)
          }
          onDecrease={() =>
            updateQuantity(item.productId, item.size, item.quantity - 1)
          }
          disableDecrease={item.quantity <= 1}
          disableIncrease={item.quantity >= item.stock}
          cart
        />
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium mt-1">NT ${item.price}</p>
          <Button
            variant="ghost"
            className=" cursor-pointer"
            onClick={() => {
              removeFromCart(item.productId, item.size);
              toast.success("已從購物車移除");
            }}
          >
            <Trash2 size={20} className="text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
