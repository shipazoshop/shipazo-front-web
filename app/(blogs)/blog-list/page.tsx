import BlogList from "@/presentation/components/blogs/BlogList";
import Features2 from "@/presentation/components/common/Features2";
import RecentProducts from "@/presentation/components/common/RecentProducts";
import Footer1 from "@/presentation/components/footers/Footer1";
import Header4 from "@/presentation/components/headers/Header4";
import React from "react";
import Link from "next/link";
export const metadata = {
  title: "Blog List || Shipazo - Multipurpose React Nextjs eCommerce",
  description: "Shipazo - Multipurpose React Nextjs eCommerce",
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
              <span className="body-small">Blog List</span>
            </li>
          </ul>
        </div>
      </div>
      <BlogList />
      <RecentProducts />
      <Features2 />
      <Footer1 />
    </>
  );
}

