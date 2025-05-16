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
      <Swiper
        spaceBetween={10}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full mb-4"
        loop={true}
      >
        {images.map((fileName, idx) => (
          <SwiperSlide key={idx}>
            <Image
              src={`/img/${brand}/${fileName}`}
              alt={`Product image ${idx + 1}`}
              width={600}
              height={600}
              className="w-full h-[580px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <div className="flex justify-center justify-items-center items-center pl-7">
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={5}
          slidesPerView={3}
          watchSlidesProgress
          modules={[FreeMode, Navigation, Thumbs]}
          className="w-max"
        >
          {images.map((fileName, idx) => (
            <SwiperSlide key={`thumb-${idx}`} className="cursor-pointer">
              <Image
                src={`/img/${brand}/${fileName}`}
                alt={`Thumbnail ${idx + 1}`}
                width={100}
                height={100}
                className="object-cover h-[120px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
