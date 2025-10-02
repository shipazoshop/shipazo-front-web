"use client";

import dynamic from "next/dynamic";

const loadingFallback = () => <div aria-hidden="true" />;

const Swiper = dynamic(
  () => import("swiper/react").then((mod) => mod.Swiper),
  { ssr: false, loading: loadingFallback }
);

const SwiperSlide = dynamic(
  () => import("swiper/react").then((mod) => mod.SwiperSlide),
  { ssr: false, loading: loadingFallback }
);

export { Swiper, SwiperSlide };
