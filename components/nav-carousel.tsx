"use client";

import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import { BANNER_MESSAGES } from "@/constant";

// Import Swiper styles
import "swiper/css";
import Link from "next/link";

const NavBarCarousel = () => {
  return (
    <div className="text-center text-[15px] py-1 bg-[#F5EEE0]">
      <Swiper
        className="h-[20pt] flex justify-center items-center"
        modules={[Autoplay, EffectFade]}
        // spaceBetween={10}
        // centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {BANNER_MESSAGES.map((item) => (
          <SwiperSlide key={item.message} className={`${item.color} font-bold`}>
            <Link href={item.url} target="_blank">
              {item.message}
            </Link>
          </SwiperSlide>
        ))}
        {/* <SwiperSlide className="text-red-600 font-bold">
          <Link href="/" target="_blank">
            母親節活動開跑！全館滿$5000享9折
          </Link>
        </SwiperSlide>
        <SwiperSlide className="text-cyan-600">
          VERSO滿$6,000 贈品牌托特包
        </SwiperSlide>
        <SwiperSlide className="text-cyan-600">
          LOEWE番茄葉 自然氣息與地中海風情的感官之旅
        </SwiperSlide>
        <SwiperSlide className="text-purple-600">
          6支柑橘調香水 潛入澄光錯落的地中海午後
        </SwiperSlide> */}
      </Swiper>
    </div>
  );
};

export default NavBarCarousel;
