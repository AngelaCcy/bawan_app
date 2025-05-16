"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
// import Image from "next/image";
import { useProductStore } from "@/app/stores/useProductStore";
import ProductImageCarousel from "@/components/products/ProductImageCarousel";
// import SizeSelector from "@/components/products/SizeSelector";
// import PriceDisplay from "@/components/products/PriceDisplay";
// import { getActiveSale } from "@/app/utils/filtering";
import ProductInfoPanel from "@/components/products/ProductInfoPanel";

const Product = () => {
  const params = useParams();
  const id = Number(params?.id);
  const { product, isLoading, fetchProductById } = useProductStore();
  // const [selectedSize, setSelectedSize] = useState<string>("");

  // useEffect(() => {
  //   if (product && product.priceItems.length > 0) {
  //     setSelectedSize(product.priceItems[0].size);
  //   }
  // }, [product]);

  useEffect(() => {
    if (id) fetchProductById(id);
  }, [id]);

  // const selectedItem = product?.priceItems.find(
  //   (item) => item.size === selectedSize
  // );
  // const activeSale = selectedItem ? getActiveSale(selectedItem) : null;

  return isLoading || !product ? (
    <div className="h-[300px] mt-40">Loading ...</div>
  ) : (
    <div className="w-full max-w-7xl mx-auto px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-30">
      <ProductImageCarousel brand={product.brand} images={product.image} />
      <ProductInfoPanel product={product} />
      {/* <div className="flex flex-col justify-start space-y-4">
        <h1 className="text-4xl font-semibold">{product.brand}</h1>
        <h2 className="text-2xl">{product.title}</h2>
        <span className="text-gray-500 text-sm">#再創新低價 #專櫃正品</span>
      </div>

      {/* Size buttons */}
      {/* <SizeSelector
        sizes={product.priceItems.map((item) => item.size)}
        disabledSizes={product.priceItems
          .filter((item) => item.stock === 0)
          .map((item) => item.size)}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      /> */}

      {/* Price section */}
      {/* {selectedItem && (
        <PriceDisplay
          regularPrice={selectedItem.price}
          salePrice={activeSale?.price}
        />
      )} */}
    </div>
  );
};
export default Product;
