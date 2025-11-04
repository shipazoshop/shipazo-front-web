"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

// Lazy load Analytics component with Recharts to reduce initial bundle size
// This saves ~300KB from the initial page load
const Analytics = dynamic(
  () => import("@/presentation/components/analytics/Analytics"),
  {
    loading: () => (
      <div className="analytics-loading">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="spinner-border text-primary">
            <span className="visually-hidden">Loading analytics...</span>
          </div>
        </div>
      </div>
    ),
    ssr: false, // Analytics doesn't need SSR, it's client-side only
  }
);

export default function AnalyticsLoader() {
  return (
    <Suspense
      fallback={
        <div className="analytics-loading">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="spinner-border text-primary">
              <span className="visually-hidden">Loading analytics...</span>
            </div>
          </div>
        </div>
      }
    >
      <Analytics />
    </Suspense>
  );
}
