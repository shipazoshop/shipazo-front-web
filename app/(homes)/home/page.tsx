import Footer1 from "@/presentation/components/footers/Footer1";
import Header1 from "@/presentation/components/headers/Header1";
import Topbar1 from "@/presentation/components/headers/Topbar1";
import EmptySearchBanner from "@/presentation/components/homes/home-5/EmptySearchBanner";
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

