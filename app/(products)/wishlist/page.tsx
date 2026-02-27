import Wishlist from "@/presentation/components/shop-cart/Wishlist";
import React from "react";
import Link from "next/link";
import Header4 from "@/presentation/components/headers/Header4";

export const metadata = {
  title: "Wishlist || Shipazo",
  description: "Shipazo - Tu lista de deseos",
};

export default function page() {
  return (
    <>
      <Header4 variant="orange" />
      <div className="tf-sp-3 pb-0">
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
              <span className="body-small">Wishlist</span>
            </li>
          </ul>
        </div>
      </div>
      <Wishlist />
    </>
  );
}
