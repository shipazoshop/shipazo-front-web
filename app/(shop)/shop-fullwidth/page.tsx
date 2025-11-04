import React from "react";
import Header4 from "@/presentation/components/headers/Header4";
import Link from "next/link";
import Products3 from "@/presentation/components/products/Products3";

export const metadata = {
  title: "Products || shipazo - Multipurpose React Nextjs eCommerce",
  description: "shipazo - Multipurpose React Nextjs eCommerce",
};
export default function page() {
  return (
    <>
      <Header4 fullWidth />
      <div className="tf-sp-1">
        <div className="container-full">
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

      <Products3 />
    </>
  );
}

