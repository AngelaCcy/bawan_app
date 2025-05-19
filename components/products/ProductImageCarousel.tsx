"use client";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
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

  return (
    <div className="w-full">
      {/* Main Image Swiper */}
      <Swiper
        spaceBetween={10}
        navigation={images.length > 1}
        thumbs={images.length > 1 ? { swiper: thumbsSwiper } : undefined}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full mb-2"
        loop={images.length > 1}
      >
        {images.map((fileName, idx) => (
          <SwiperSlide key={idx}>
            <Image
              src={`/img/${brand}/${fileName}`}
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
          slidesPerView={Math.min(images.length, 4)}
          watchSlidesProgress
          modules={[FreeMode, Navigation, Thumbs]}
          className="w-max"
        >
          {images.map((fileName, idx) => (
            <SwiperSlide key={`thumb-${idx}`} className="cursor-pointer">
              <Image
                src={`/img/${brand}/${fileName}`}
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
