import BrandsSlider from "@/presentation/components/common/BrandsSlider";
import RecentProducts from "@/presentation/components/common/RecentProducts";
import Footer1 from "@/presentation/components/footers/Footer1";
import Header4 from "@/presentation/components/headers/Header4";
import Description4 from "@/presentation/components/product-detail/Description4";
import Details6 from "@/presentation/components/product-detail/Details6";
import Relatedproducts from "@/presentation/components/product-detail/Relatedproducts";
import SimilerProducts from "@/presentation/components/product-detail/SimilerProducts";
import React from "react";
import Link from "next/link";
export const metadata = {
  title: "Product Details 04 || shipazo - Multipurpose React Nextjs eCommerce",
  description: "shipazo - Multipurpose React Nextjs eCommerce",
};
export default function page() {
  return (
    <>
      <Header4 />
      <div className="bg-3">
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
                <Link href={`/product-grid`} className="body-small link">
                  {" "}
                  Shop{" "}
                </Link>
              </li>
              <li className="d-flex align-items-center">
                <i className="icon icon-arrow-right" />
              </li>
              <li>
                <span className="body-small">Product Detail 4</span>
              </li>
            </ul>
          </div>
        </div>
        <Details6 />
        <Description4 />
        <SimilerProducts />
        <Relatedproducts />
        <BrandsSlider />
        <RecentProducts />{" "}
      </div>
      <Footer1 />
    </>
  );
}

