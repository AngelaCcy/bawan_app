"use client";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { brands, filterOther } from "@/constant";
import { Slider } from "@/components/ui/slider";
import { useProductStore } from "@/hooks/useProductStore";
import { ProductWithPrice } from "@/app/types/product";
import { useEffect, useState } from "react";
import { getActivePrice } from "@/app/utils/filtering";

// type PriceEntry = { size: string; price: number };

type FilterBarProps = {
  selected: string[];
  onChange: (newSelected: string[]) => void;
  onPriceChange: (range: number[]) => void;
  selectedOther: string[];
  onOtherChange: (newSelected: string[]) => void;
};

export default function FilterBar({
  selected,
  onChange,
  onPriceChange,
  selectedOther,
  onOtherChange,
}: FilterBarProps) {
  const { allProducts } = useProductStore();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([
    0, 0,
  ]);

  useEffect(() => {
    if (allProducts.length > 0) {
      const prices: number[] = (allProducts as ProductWithPrice[]).map(
        (product) => {
          const first = product.priceItems[0];
          if (!first) return 0;
          return getActivePrice(first);
        }
      );
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange({ min, max });
      setSelectedPriceRange([min, max]);
      onPriceChange([min, max]);
    }
  }, [allProducts]);

  const handleFilterToggle = (itemId: string) => {
    //check if the selected checkbox is belongs to Other filter section
    const isOther = filterOther.some((f) => f.id === itemId);
    if (isOther) {
      const isSelected = selectedOther.includes(itemId);
      const updated = isSelected
        ? selectedOther.filter((id) => id !== itemId)
        : [...selectedOther, itemId];
      onOtherChange(updated);
    } else {
      const isSelected = selected.includes(itemId);
      const updated = isSelected
        ? selected.filter((id) => id !== itemId)
        : [...selected, itemId];

      onChange(updated);
    }
  };

  return (
    <div className=" text-[18px] lg:pr-20 pr-20 mb-30">
      <Button
        variant="custom"
        onClick={() => {
          onChange([]);
          setSelectedPriceRange([priceRange.min, priceRange.max]);
          onPriceChange([priceRange.min, priceRange.max]);
          onOtherChange([]);
        }}
        className="p-5 mb-4 md:w-60 rounded-3xl md:text-[18px]"
      >
        清除全部篩選條件
      </Button>
      <div className="space-y-2 border-black border-t-2 pt-2 pl-3">
        <p className="font-bold text-md mb-2">品牌</p>
        {brands.map((brand) => (
          <div key={brand.id} className="flex items-start space-x-2">
            <Checkbox
              checked={selected.includes(brand.id)}
              onCheckedChange={() => handleFilterToggle(brand.id)}
              className="border-black text-black data-[state=checked]:bg-black"
            />
            <label className="text-sm">{brand.label}</label>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2 border-black border-t-2 pt-2 pl-3">
        <p className="font-bold text-md mb-2">定價</p>
        <Slider
          value={selectedPriceRange}
          onValueChange={(newRange) => {
            setSelectedPriceRange(newRange);
            onPriceChange(newRange);
          }}
          min={priceRange.min}
          max={priceRange.max}
          step={100}
          className="pr-1 pt-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>NT ${selectedPriceRange[0]}</span>
          <span>NT ${selectedPriceRange[1]}</span>
        </div>
      </div>
      <div className="mt-3 space-y-2 border-black border-t-2 pt-2 pl-3">
        <p className="font-bold text-md mb-2">其他</p>
        {filterOther.map((item) => (
          <div key={item.id} className="flex items-start space-x-2">
            <Checkbox
              checked={selectedOther.includes(item.id)}
              onCheckedChange={() => handleFilterToggle(item.id)}
              className="border-black text-black data-[state=checked]:bg-black"
            />
            <label className="text-sm">{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
