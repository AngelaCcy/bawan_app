"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductWithPrice } from "@/app/types/product";
import { getActiveSale } from "@/app/utils/filtering";

interface Props {
  products: ProductWithPrice[];
}

export default function TopTenCarousel({ products }: Props) {
  return (
    <section className="py-16 bg-[#EDEDE9]" data-aos="fade-up">
      <h2 className="text-center text-2xl font-semibold tracking-widest mb-10 text-gray-700">
        ～ TOP 10 ～
      </h2>
      <div className="max-w-6xl mx-auto px-4">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          slidesPerView={2}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {products.map((product) => {
            const firstItem = product.priceItems[0];
            const sale = firstItem ? getActiveSale(firstItem) : null;
            const price = sale?.price ?? firstItem?.price ?? 0;
            const imgSrc = product.image[0]
              ? `/img/${product.brand}/${product.image[0]}`
              : "/img/logo.png";

            return (
              <SwiperSlide key={product.id}>
                <Link href={`/products/${product.id}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition group cursor-pointer">
                    <div className="relative w-full aspect-square bg-[#F5EEE0]">
                      <Image
                        src={imgSrc}
                        alt={product.title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                      {sale && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                          SALE
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-[#B08866] font-medium">{product.brand}</p>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2 mt-0.5">
                        {product.title}
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        NT$ {price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
