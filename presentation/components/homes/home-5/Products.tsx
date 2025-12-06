"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import AddToCart from "@/presentation/components/common/AddToCart";
import AddToCompare from "@/presentation/components/common/AddToCompare";
import AddToQuickview from "@/presentation/components/common/AddToQuickview";
import AddToWishlist from "@/presentation/components/common/AddToWishlist";
import { products17 } from "@/shared/constants/products";
import { getHoverImage, getOldPrice } from "@/shared/utils/product";

type Product = (typeof products17)[number];

const renderProductCard = (product: Product) => {
  const oldPrice = getOldPrice(product);

  return (
    <li key={product.id}>
      <div className="card-product style-row row-small-2">
        <div className="card-product-wrapper img-small">
          <Link href={`/product-detail/${product.id}`} className="product-img">
            <Image
              className="img-product lazyload"
              src={product.imgSrc}
              alt="image-product"
              width={product.width}
              height={product.height}
            />
            <Image
              className="img-hover lazyload"
              src={getHoverImage(product) ?? product.imgSrc}
              alt="image-product"
              width={product.width}
              height={product.height}
            />
          </Link>
        </div>
        <div className="card-product-info">
          <div className="box-title">
            <div className="bg-white relative z-5">
              <Link
                href={`/product-detail/${product.id}`}
                className="name-product body-text-3 link"
              >
                {product.title}
              </Link>
            </div>
            <div className="group-btn">
              <p className="price-wrap fw-semibold">
                <span className="new-price">${product.price.toFixed(3)}</span>
                {oldPrice !== undefined && (
                  <span className="old-price">${oldPrice.toFixed(3)}</span>
                )}
              </p>
              <ul className="list-product-btn style-2 flex-row">
                <li>
                  <AddToCart productId={product.id} />
                </li>
                {/* <li className="d-none d-sm-block wishlist">
                  <AddToWishlist productId={product.id} />
                </li> */}
                <li>
                  <AddToQuickview productId={product.id} />
                </li>
                <li className="d-none d-sm-block">
                  <AddToCompare productId={product.id} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default function Products() {
  return (
    <section className="box-btn-slide-item">
      <div className="flat-title wow fadeInUp" data-wow-delay="0s">
        <h5 className="fw-semibold">Best Seller</h5>
        <div className="box-btn-slide relative">
          <div className="swiper-button-prev nav-swiper nav-prev-products snbp46">
            <i className="icon-arrow-left-lg" />
          </div>
          <div className="swiper-button-next nav-swiper nav-next-products snbn46">
            <i className="icon-arrow-right-lg" />
          </div>
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".snbp46",
          nextEl: ".snbn46",
        }}
        className="swiper tf-sw-products"
        spaceBetween={30}
      >
        <SwiperSlide className="swiper-slide">
          <ul className="product-list-wrap wow fadeInUp" data-wow-delay="0s">
            {products17.map(renderProductCard)}
          </ul>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <ul className="product-list-wrap">
            {products17.map(renderProductCard)}
          </ul>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
