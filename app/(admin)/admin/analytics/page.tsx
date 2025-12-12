import Footer1 from "@/presentation/components/footers/Footer1";
import Header4 from "@/presentation/components/headers/Header4";
import AnalyticsLoader from "@/presentation/components/analytics/AnalyticsLoader";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Sales Analytics || Shipazo - Multipurpose React Nextjs eCommerce",
  description: "Shipazo - Sales Analytics Dashboard",
};

export default function page() {
  return (
    <section className="tf-sp-2">
      <div className="container">
        <AnalyticsLoader />
      </div>
    </section>
  );
}
