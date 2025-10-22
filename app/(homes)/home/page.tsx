import Features from "@/presentation/components/common/Features";

import Footer1 from "@/presentation/components/footers/Footer1";
import Header1 from "@/presentation/components/headers/Header1";
import Topbar1 from "@/presentation/components/headers/Topbar1";
import Banner from "@/presentation/components/homes/home-5/Banner";
import Banner2 from "@/presentation/components/homes/home-5/Banner2";
import Banner3 from "@/presentation/components/homes/home-5/Banner3";
import Banner4 from "@/presentation/components/homes/home-5/Banner4";
import Blogs from "@/presentation/components/homes/home-5/Blogs";
import Brands from "@/presentation/components/homes/home-5/Brands";
import Categories from "@/presentation/components/homes/home-5/Categories";
import Collections from "@/presentation/components/homes/home-5/Collections";
import EmptySearchBanner from "@/presentation/components/homes/home-5/EmptySearchBanner";
import Products from "@/presentation/components/homes/home-5/Products";
import Products2 from "@/presentation/components/homes/home-5/Products2";
import Products3 from "@/presentation/components/homes/home-5/Products3";
import Products4 from "@/presentation/components/homes/home-5/Products4";
import Products5 from "@/presentation/components/homes/home-5/Products5";
import Products6 from "@/presentation/components/homes/home-5/Products6";
import Products7 from "@/presentation/components/homes/home-5/Products7";
import React from "react";

export const metadata = {
  title: "Home || shipazo - Multipurpose React Nextjs eCommerce",
  description: "shipazo- Multipurpose React Nextjs eCommerce",
};
export default function page() {
  return (
    <>
      <Topbar1 parentClass="tf-topbar" />
      <Header1 />
      <div className="tf-sp-7">
        <div className="container">
          <div className="container-wrap">
            {/* <div className="container-sidebar d-none">
              console.log(`🚀 ~ page ~   <div className="container-sidebar d-none">
              <Products />
              <Banner />
              <Products2 />
              <Banner2 />
              <Brands />
              <Blogs />
            </div>:`,   <div className="container-sidebar d-none">
              <Products />
              <Banner />
              <Products2 />
              <Banner2 />
              <Brands />
              <Blogs />
            </div>)
              <Products />
              <Banner />
              <Products2 />
              <Banner2 />
              <Brands />
              <Blogs />
            </div> */}
            <div className="container-main">
              <EmptySearchBanner />
              {/* <Products4 /> */}
              {/* <Products5 />
              <Banner4 />
              <Products6 />
              <Products7 /> */}
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </>
  );
}

