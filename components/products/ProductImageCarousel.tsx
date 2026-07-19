"use client";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { productImageSrc } from "@/lib/utils";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

type Props = {
  images: string[];
  brand: string;
};

export default function ProductImageCarousel({ images, brand }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  // Imported products may have no image — show the placeholder instead of
  // an empty carousel ("" makes productImageSrc fall back to it)
  const displayImages = images.length > 0 ? images : [""];

  return (
    <div className="w-full">
      {/* Main Image Swiper */}
      <Swiper
        spaceBetween={10}
        navigation={displayImages.length > 1}
        thumbs={displayImages.length > 1 ? { swiper: thumbsSwiper } : undefined}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full mb-2"
        loop={displayImages.length > 1}
      >
        {displayImages.map((fileName, idx) => (
          <SwiperSlide key={idx}>
            <Image
              src={productImageSrc(brand, fileName)}
              alt={`Product image ${idx + 1}`}
              width={400}
              height={400}
              className="w-full h-[680px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <div className="flex justify-center items-center pl-7 gap-2 mt-2">
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={false}
          spaceBetween={2}
          slidesPerView={Math.min(displayImages.length, 4)}
          watchSlidesProgress
          modules={[FreeMode, Navigation, Thumbs]}
          className="w-max"
        >
          {displayImages.map((fileName, idx) => (
            <SwiperSlide key={`thumb-${idx}`} className="cursor-pointer">
              <Image
                src={productImageSrc(brand, fileName)}
                alt={`Thumbnail ${idx + 1}`}
                width={80}
                height={100}
                className="object-cover w-[80px] h-[100px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
