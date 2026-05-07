"use client";

import React from "react";
import HomeBackground from "@/presentation/components/homes/home-v8/HomeBackground";
import HeaderV8 from "@/presentation/components/headers/HeaderV8";
import HomeHero from "@/presentation/components/homes/home-v8/HomeHero";
import HowItWorksV8 from "@/presentation/components/homes/home-v8/HowItWorksV8";
import BrandsMarqueeV8 from "@/presentation/components/homes/home-v8/BrandsMarqueeV8";
import TrustBandV8 from "@/presentation/components/homes/home-v8/TrustBandV8";
import TestimonialsV8 from "@/presentation/components/homes/home-v8/TestimonialsV8";
import BenefitsV8 from "@/presentation/components/homes/home-v8/BenefitsV8";
import FooterV8 from "@/presentation/components/footers/FooterV8";
import { AdminFloatingButton } from "@/presentation/components/common/AdminFloatingButton";

export default function HomePage() {
  return (
    <>
      {/* Fixed background: mesh gradient + grain + parallax */}
      <HomeBackground />

      {/* Page content stacks above z-index: 2 */}
      <div className="hv8-page">
        <HeaderV8 />
        <HomeHero />
        <HowItWorksV8 />
        <BrandsMarqueeV8 />
        <TrustBandV8 />
        <TestimonialsV8 />
        <BenefitsV8 />
        <FooterV8 />
      </div>

      <AdminFloatingButton />

      <style>{`
        .hv8-page {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          color: white;
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>
    </>
  );
}
