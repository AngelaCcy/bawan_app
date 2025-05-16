"use client";

import { Button } from "@/components/ui/button";

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disableDecrease?: boolean;
  disableIncrease?: boolean;
  cart?: boolean;
}

export default function QuantityController({
  quantity,
  onIncrease,
  onDecrease,
  disableDecrease = false,
  disableIncrease = false,
  cart,
}: Props) {
  return (
    <div
      className={`flex items-center gap-2 font-semibold  ${
        cart ? "text[10px]" : "text-[20px]"
      }`}
    >
      <Button
        variant="quantityBtn"
        size="icon"
        onClick={onDecrease}
        disabled={disableDecrease}
        className={` p-0 ${
          cart ? "text[10px] w-7 h-7" : "text-[25px] w-10 h-10"
        }`}
      >
        -
      </Button>
      <span className="w-6 text-center">{quantity}</span>
      <Button
        variant="quantityBtn"
        size="icon"
        onClick={onIncrease}
        disabled={disableIncrease}
        className={` p-0 ${
          cart ? "text[10px] w-7 h-7" : "text-[25px] w-10 h-10"
        }`}
      >
        +
      </Button>
    </div>
  );
}
