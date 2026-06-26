import Image from "next/image";
import Link from "next/link";
import { ProductWithPrice } from "@/app/types/product";

interface Props {
  product: ProductWithPrice | null;
}

export default function NewArrival({ product }: Props) {
  if (!product) return null;

  const imgSrc = product.image[0]
    ? `/img/${product.brand}/${product.image[0]}`
    : "/img/logo.png";

  return (
    <section className="relative w-full min-h-[520px] overflow-hidden" data-aos="fade-up">
      {/* Dark background */}
      <Image
        src="/img/doson1.png"
        alt="new arrival background"
        fill
        className="object-cover object-center brightness-50"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-20">
        <h2 className="text-center text-white/90 text-xl tracking-widest mb-10">
          ～ NEW ～
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Text */}
        <div className="flex-1 text-white">
          <p className="text-xs text-white/70 mb-2">{product.category}</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">
            {product.brand}<br />
            <span className="text-[#D4A76A]">「{product.title}」</span>
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-sm">
            {product.description?.slice(0, 80) ?? "探索全新香氛系列，感受獨特的氣息與個性。"}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="inline-block border border-white text-white hover:bg-white hover:text-gray-900 text-sm tracking-widest px-8 py-3 rounded-full transition-colors"
          >
            探索新品
          </Link>
        </div>

        {/* Product image */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-64 h-64">
            <Image
              src={imgSrc}
              alt={product.title}
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
