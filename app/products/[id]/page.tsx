"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useProductStore } from "@/hooks/useProductStore";
import ProductImageCarousel from "@/components/products/ProductImageCarousel";
import ProductDetailTabs from "@/components/products/ProductDetailTabs";
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
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-30">
        <ProductImageCarousel brand={product.brand} images={product.image} />
        <ProductInfoPanel product={product} />
      </div>
      <ProductDetailTabs productId={id} />
    </>
  );
};
export default Product;
