import Image from "next/image";
import Link from "next/link";
import { ProductWithPrice } from "@/app/types/product";

interface Props {
  products: ProductWithPrice[];
}

export default function BrandSpotlight({ products }: Props) {
  if (products.length === 0) return null;

  const product = products[0];
  const imgSrc = product.image[0]
    ? `/img/${product.brand}/${product.image[0]}`
    : "/img/ESSENSORIE/經典熱賣組.png";

  return (
    <section className="py-16 bg-[#F5EEE0]" data-aos="fade-up">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Product image */}
        <div className="flex-1 relative aspect-square max-w-xs w-full rounded-2xl overflow-hidden shadow-md">
          <Image
            src={imgSrc}
            alt={product.brand}
            fill
            className="object-cover"
          />
        </div>

        {/* Brand story */}
        <div className="flex-1">
          <p className="text-xs text-[#B08866] tracking-widest font-medium mb-2">墨爾本必買</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">ESSENSORIE</h2>
          <p className="text-xl font-semibold text-gray-700 mb-4">台灣無專櫃！！！</p>
          <p className="text-sm text-gray-500 leading-relaxed mb-2">
            墨爾本本植物性香氛品牌，堅信100%天然植物萃餾球製，從植物中提取香氛，將大自然融入生活。
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            淡淡私人調香家族企業，工作坊手工製造的自式香氛＆護理品息，全部純天然植物/花草萃取而成，
            瓶罐都是可回收的環保材質，重視自然與永續。
          </p>
          <Link
            href="/products"
            className="inline-block border border-[#9e7c59] text-[#9e7c59] hover:bg-[#9e7c59] hover:text-white text-sm tracking-widest px-8 py-3 rounded-full transition-colors"
          >
            探索品牌
          </Link>
        </div>
      </div>
    </section>
  );
}
