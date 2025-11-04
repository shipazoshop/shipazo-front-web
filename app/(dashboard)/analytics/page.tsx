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
    <>
      <Header4 />
      <div className="tf-sp-1 pb-0">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href={`/`} className="body-small link">
                Home
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">Analytics</span>
            </li>
          </ul>
        </div>
      </div>
      <section className="tf-sp-2">
        <div className="container">
          <AnalyticsLoader />
        </div>
      </section>
    </>
  );
}
