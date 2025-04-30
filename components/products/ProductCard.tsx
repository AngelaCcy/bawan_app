import Image from "next/image";
// import { useCartStore } from "@/app/stores/useCartStore";
import { SaleProduct as Product } from "@/app/utils/fake-data";
// import HeartButton from "../HeartButton";
import { User } from "@prisma/client";
import Link from "next/link";

interface Props {
  product: Product;
  currentUser?: User | null;
}

// export default function ProductCard({ product, currentUser }: Props) {
export default function ProductCard({ product }: Props) {
  // const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="hover:-animate-bounce-y bg-[#ECE2D0] rounded-lg shadow-md overflow-hidden hover:shadow-xl flex flex-col justify-between p-4 relative cursor-pointer">
      <Link href={`/products/${product.id}`} passHref>
        <Image
          src={product.images[0]}
          alt={product.title}
          width={400}
          height={400}
          className="object-cover w-full h-[180px] "
          priority
        />
        <div className="flex-1 flex flex-col justify-between">
          <h2 className="text-lg font-semibold line-clamp-1 my-1.5">
            {product.brand}
          </h2>
          <h2 className="text-lg line-clamp-1">{product.title}</h2>
          <div className="mt-2">
            <span className="border-black p-1 border-1 rounded-sm text-sm">
              250ml
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {product.salePrice ? (
              <div className="flex flex-col">
                <span className="text-red-500 font-semibold">
                  NT ${product.salePrice.toFixed(2)}
                </span>
                <span className="text-gray-800 font-semibold text-sm line-through">
                  NT ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-gray-800 font-semibold">
                NT ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
