import React from "react";
import Header4 from "@/presentation/components/headers/Header4";
import Products1 from "@/presentation/components/products/Products1";
import RecentProducts from "@/presentation/components/common/RecentProducts";
import Features2 from "@/presentation/components/common/Features2";
import Footer1 from "@/presentation/components/footers/Footer1";
import Link from "next/link";

export const metadata = {
  title: "Products || shipazo - Multipurpose React Nextjs eCommerce",
  description: "shipazo - Multipurpose React Nextjs eCommerce",
};
export default function page() {
  return (
    <>
      <Header4 />
      <div className="tf-sp-1">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href={`/`} className="body-small link">
                {" "}
                Home{" "}
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">Product Grid</span>
            </li>
          </ul>
        </div>
      </div>

      <Products1 />
      <RecentProducts />
      <Features2 />
      <Footer1 />
      <div className="overlay-filter" id="overlay-filter" />
    </>
  );
}

