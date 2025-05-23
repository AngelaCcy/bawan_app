"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function AOSInitializer() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 700,
      easing: "ease-out-cubic",
      offset: 100,
    });
  }, []);

  return null;
}
