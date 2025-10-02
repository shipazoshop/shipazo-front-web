import BrandsSlider from "@/presentation/components/common/BrandsSlider";
import Features from "@/presentation/components/common/Features";
import Footer1 from "@/presentation/components/footers/Footer1";
import Header4 from "@/presentation/components/headers/Header4";
import Blogs from "@/presentation/components/otherPages/about/Blogs";
import Hero from "@/presentation/components/otherPages/about/Hero";
import Testimonials from "@/presentation/components/otherPages/about/Testimonials";
import React from "react";
import Link from "next/link";
export const metadata = {
  title: "About || shipazo - Multipurpose React Nextjs eCommerce",
  description: "shipazo - Multipurpose React Nextjs eCommerce",
};
export default function page() {
  return (
    <>
      <Header4 />
      <div className="tf-sp-3 pb-0">
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
              <span className="body-small">About</span>
            </li>
          </ul>
        </div>
      </div>
      <Hero />
      <Features />
      <Testimonials />
      <BrandsSlider fullWidth />
      <Blogs />
      <Footer1 />
    </>
  );
}

