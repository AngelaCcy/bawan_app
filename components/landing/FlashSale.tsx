"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  endTime: Date | null;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getTimeLeft(end: Date) {
  const diff = Math.max(0, end.getTime() - Date.now());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return { h, m, s, done: diff === 0 };
}

type TimeLeft = ReturnType<typeof getTimeLeft>;

export default function FlashSale({ endTime }: Props) {
  // null until client mounts — avoids SSR/hydration mismatch from Date.now()
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!endTime) return;
    setTime(getTimeLeft(endTime));
    const id = setInterval(() => {
      const t = getTimeLeft(endTime);
      setTime(t);
      if (t.done) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  if (!endTime || !time || time.done) return null;

  return (
    <section className="bg-[#F5EEE0] py-14" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-6xl md:text-8xl font-bold tracking-tight text-gray-800 font-mono">
          {pad(time.h)}
          <span className="text-[#B08866] mx-1">:</span>
          {pad(time.m)}
          <span className="text-[#B08866] mx-1">:</span>
          {pad(time.s)}
        </div>

        <div className="text-center md:text-left">
          <p className="text-sm text-[#B08866] font-medium tracking-widest mb-1">限時折扣</p>
          <p className="text-2xl font-bold text-gray-800 mb-4">
            滿 <span className="text-[#9e7c59]">$2,000</span> 享 9 折！
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#9e7c59] hover:bg-[#8a6a4a] text-white text-sm tracking-widest px-8 py-3 rounded-full transition-colors"
          >
            立即選購
          </Link>
        </div>
      </div>
    </section>
  );
}
