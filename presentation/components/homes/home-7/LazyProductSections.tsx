"use client";

import dynamic from "next/dynamic";
import LazySection from "@/presentation/components/common/LazySection";
import React from "react";

const SectionSkeleton = ({ minHeight = 280 }) => (
  <div
    aria-hidden="true"
    className="w-100"
    style={{
      minHeight,
      backgroundColor: "rgba(240, 240, 240, 0.85)",
      borderRadius: "1.25rem",
    }}
  />
);

const Products2Section = dynamic(
  () => import("@/presentation/components/homes/home-7/Products2"),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight={360} />,
  }
);

const Products3Section = dynamic(
  () => import("@/presentation/components/homes/home-7/Products3"),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight={480} />,
  }
);

const Products4Section = dynamic(
  () => import("@/presentation/components/common/Products2"),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight={420} />,
  }
);

const Banner2Section = dynamic(
  () => import("@/presentation/components/common/Banner2"),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight={300} />,
  }
);

const Products5Section = dynamic(
  () => import("@/presentation/components/common/Products"),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight={420} />,
  }
);

const RecentProductsSection = dynamic(
  () => import("@/presentation/components/common/RecentProducts"),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight={360} />,
  }
);

export default function LazyProductSections() {
  return (
    <>
      <LazySection rootMargin="400px 0px" fallback={<SectionSkeleton minHeight={360} />}>
        <Products2Section />
      </LazySection>
      <LazySection rootMargin="400px 0px" fallback={<SectionSkeleton minHeight={480} />}>
        <Products3Section />
      </LazySection>
      <LazySection rootMargin="400px 0px" fallback={<SectionSkeleton minHeight={420} />}>
        <Products4Section title="Smartphones" parentClass="tf-sp-2" />
      </LazySection>
      <LazySection rootMargin="400px 0px" fallback={<SectionSkeleton minHeight={320} />}>
        <Banner2Section />
      </LazySection>
      <LazySection rootMargin="400px 0px" fallback={<SectionSkeleton minHeight={420} />}>
        <Products5Section />
      </LazySection>
      <LazySection rootMargin="400px 0px" fallback={<SectionSkeleton minHeight={360} />}>
        <RecentProductsSection parentClass="tf-sp-2 pt-0" />
      </LazySection>
    </>
  );
}

