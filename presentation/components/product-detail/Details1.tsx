"use client";
import React, { useState } from "react";
import Slider1 from "./sliders/Slider1";
import Link from "next/link";
import { IImportProductResponse } from "../../../domain/dto/import-product.dto";
import { LoadingScreen } from "../common/LoadingScreen";
import { useCartActions } from "@/application/stores/useCartStore";

export default function Details1({ product }: Readonly<{ product: IImportProductResponse }>) {
  console.log("🚀 ~ Details1 ~ product:", product)

  const [quantity, setQuantity] = useState(1);
  const { addProductToCart, isAddedToCartProducts } = useCartActions();

  if (!product) return <LoadingScreen show />;

  return (
    <section>
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              {/* Product Image */}
              <div className="tf-product-media-wrap thumbs-default sticky-top">
                <div className="thumbs-slider">
                  <Slider1 productImages={product?.productData?.images ?? ['']} />
                </div>
              </div>
              {/* /Product Image */}
            </div>
            <div className="col-md-6">
              {/* Product Infor */}
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom flex-xxl-nowrap">
                  <div className="tf-product-info-content">
                    <div className="infor-heading">
                      {/* <p className="caption">
                        Categories:
                        <Link
                          href={`/shop-default`}
                          className="link text-secondary"
                        >
                          Consumer Electronics
                        </Link>
                      </p> */}
                      <h5 className="product-info-name fw-semibold">
                        {product?.productData.title ??
                          ``}
                      </h5>
                      {/* <ul className="product-info-rate-wrap">
                        <li className="star-review">
                          <ul className="list-star">
                            <li>
                              <i className="icon-star" />
                            </li>
                            <li>
                              <i className="icon-star" />
                            </li>
                            <li>
                              <i className="icon-star" />
                            </li>
                            <li>
                              <i className="icon-star" />
                            </li>
                            <li>
                              <i className="icon-star text-main-4" />
                            </li>
                          </ul>
                          <p className="caption text-main-2">Reviews (1.738)</p>
                        </li>
                        <li>
                          <p className="caption text-main-2">Sold: 349</p>
                        </li>
                        <li className="d-flex">
                          <Link
                            href={`${product.url}`}
                            className="caption text-secondary link"
                          >
                            View shop
                          </Link>
                        </li>
                      </ul> */}
                    </div>
                    <div className="infor-center">
                      <div className="product-info-price">
                        <h4 className="text-primary">
                          {product.productData.currency}{product.productData.price_details?.priceBreakdown?.priceUsd}
                        </h4>{" "}
                        {product.productData.price_details.original_price && (
                          <span className="price-text text-main-2 old-price">
                            {product.productData.currency}{product.productData.price_details.original_price}
                          </span>
                        )}
                      </div>
                      <ul className="product-fearture-list">
                        <li>
                          <p className="body-md-2 fw-semibold">Tienda</p>
                          <span className="body-text-3">{product.productData.brand ?? ''}</span>
                        </li>
                        <li>
                          <p className="body-md-2 fw-semibold">Dimensiones</p>
                          <span className="body-text-3">{product.productData.dimensions ?? ''}</span>
                        </li>
                        <li>
                          <p className="body-md-2 fw-semibold">Peso</p>
                          <span className="body-text-3">{product.productData.weight}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="infor-bottom">
                      <h6 className="fw-semibold">Sobre este artículo</h6>
                      <ul className="product-about-list">
                        <li>
                          <p className="body-text-3">
                            {product.productData.description ?? ''}
                          </p>
                        </li>

                      </ul>
                    </div>
                  </div>
                  <div className="tf-product-info-choose-option sticky-top">
                    <div className="product-delivery">
                      {
                        Boolean(product.productData?.price_details?.calculatedPriceGtq) &&
                        <p className="price-text fw-medium text-primary">
                          Q{product.productData.price_details.calculatedPriceGtq.toFixed(2)}
                        </p>
                      }
                      <p>
                        <i className="icon-delivery-2" /> Shipping: Q{product.productData?.price_details?.priceBreakdown?.shippingCost?.toFixed(2)}
                      </p>
                      {/* <div className="shipping-to">
                        <p className="body-md-2">Shipping to:</p>
                        <div className="tf-cur">
                          <div className="tf-cur-item">
                            <select className="select-default cs-pointer fw-semibold body-md-2">
                              <option>Metro Manila</option>
                              <option>Metro Manila</option>
                            </select>
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <div className="product-quantity">
                      <p className="title body-text-3">Quantity</p>
                      <div className="wg-quantity">
                        <button
                          className="btn-quantity btn-decrease"
                          onClick={() =>
                            setQuantity((pre) => (pre == 1 ? 1 : pre - 1))
                          }
                        >
                          <i className="icon-minus" />
                        </button>
                        <input
                          className="quantity-product"
                          type="text"
                          readOnly
                          value={quantity}
                        />
                        <button
                          className="btn-quantity btn-increase"
                          onClick={() => setQuantity((pre) => pre + 1)}
                        >
                          <i className="icon-plus" />
                        </button>
                      </div>
                    </div>
                    <div className="product-color">
                      <p className="title body-text-3">Color</p>
                      <div className="tf-select-color">
                        <select className="select-color">
                          <option>Graphite Black</option>
                          <option>Graphite Blue</option>
                        </select>
                      </div>
                    </div>
                    <div className="product-box-btn">
                      <a
                        href="#shoppingCart"
                        data-bs-toggle="offcanvas"
                        className="tf-btn text-white"
                        onClick={() => addProductToCart(product, quantity)}
                      >
                        {isAddedToCartProducts(product.productData.product_id)
                          ? "Already Added"
                          : "Add to cart"}
                        <i className="icon-cart-2" />
                      </a>
                      <Link
                        href={`/shop-cart`}
                        className="tf-btn text-white btn-gray"
                      >
                        Buy now
                      </Link>
                    </div>
                    <div className="product-detail">
                      <p className="caption">Details</p>
                      <p className="body-text-3">
                        <span>
                          Return policy: Eligible for Return, Refund or
                          Replacement within 30 days of receipt
                        </span>
                        <span>Support: Free Amazon tech support included</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Product Infor */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

