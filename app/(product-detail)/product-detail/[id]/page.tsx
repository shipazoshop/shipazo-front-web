import BrandsSlider from "@/presentation/components/common/BrandsSlider";
import RecentProducts from "@/presentation/components/common/RecentProducts";
import Footer1 from "@/presentation/components/footers/Footer1";
import Header4 from "@/presentation/components/headers/Header4";
import Description from "@/presentation/components/product-detail/Description";
import Details1 from "@/presentation/components/product-detail/Details1";
import Relatedproducts from "@/presentation/components/product-detail/Relatedproducts";
import SimilerProducts from "@/presentation/components/product-detail/SimilerProducts";
import React from "react";
import Link from "next/link";
import { allProducts } from "@/shared/constants/products";
export const metadata = {
  title: "Product Details || shipazoazoazos - Multipurpose React Nextjs eCommerce",
  description: "shipazoazos - Multipurpose React Nextjs eCommerce",
};
export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  const product = allProducts.filter((p) => p.id == id)[0] || allProducts[0];

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
              <Link href={`/product-grid`} className="body-small link">
                {" "}
                Shop{" "}
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">Product Detail</span>
            </li>
          </ul>
        </div>
      </div>
      <Details1 product={product} />
      <Description />
      <SimilerProducts />
      <Relatedproducts />
      <BrandsSlider />
      <RecentProducts />
      <Footer1 />
    </>
  );
}

