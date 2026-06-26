"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HeroSection() {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <Image
        src="/img/doson2.png"
        alt="bawan hero"
        fill
        priority
        className="object-cover object-center"
      />
      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-50/30 via-transparent to-[#EDEDE9]/80" />

      {/* Floating product */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-8"
        data-aos="fade-up"
      >
        <Image
          src="/img/Diptyque/DIPTYQUE_花都之水.png"
          alt="featured product"
          width={320}
          height={320}
          className="object-contain drop-shadow-2xl"
        />
        <Link
          href="/products"
          className="bg-[#9e7c59] hover:bg-[#8a6a4a] text-white text-sm tracking-widest px-10 py-3 rounded-full transition-colors"
        >
          探索商品
        </Link>
      </div>
    </section>
  );
}
