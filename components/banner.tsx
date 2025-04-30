"use client";
import { useState, useEffect } from "react";
import { FAKE_BANNER_MESSAGES } from "@/app/utils/fake-data";

const Banner = () => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      // Update the index after a short delay to allow the animation to start
      setTimeout(() => {
        setIndex((prev) =>
          prev === FAKE_BANNER_MESSAGES.length - 1 ? 0 : prev + 1
        );
        setIsAnimating(true);
      }, 10);
    }, 5000);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="flex justify-center text-[13px] py-1 bg-[#F5EEE0]">
      {/* <div className="animate-slideinright w-full text-center"> */}
      <div
        key={index}
        className={`text-center $ ${isAnimating ? "animate-slideUpFade" : ""}`}
      >
        {FAKE_BANNER_MESSAGES[index]}
      </div>
    </div>
  );
};

export default Banner;
