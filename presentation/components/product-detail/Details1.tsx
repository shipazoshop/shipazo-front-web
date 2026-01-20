"use client";
import React, { useState, useEffect } from "react";
import Slider1 from "./sliders/Slider1";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { IImportProductResponse } from "../../../domain/dto/import-product.dto";
import { LoadingScreen } from "../common/LoadingScreen";
import { useCartActions, useCartProducts } from "@/application/stores/useCartStore";
import { useWishlistActions, useWishlist } from "@/application/stores/useWishlistStore";

export default function Details1({ product }: Readonly<{ product: IImportProductResponse }>) {
  const [quantity, setQuantity] = useState(1);
  const [specification, setSpecification] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const { addProductToCart, isAddedToCartProducts, updateProductSpecification, getProductSpecification } = useCartActions();
  const { toggleWishlist } = useWishlistActions();
  const cartProducts = useCartProducts();

  // Verificar si el producto está en el carrito
  const isInCart = product ? isAddedToCartProducts(product.productData.product_id) : false;

  // Cargar la especificación guardada cuando el producto está en el carrito
  useEffect(() => {
    if (isInCart && product) {
      const savedSpec = getProductSpecification(product.productData.product_id);
      if (savedSpec) {
        setSpecification(savedSpec);
      }
    }
  }, [isInCart, product, getProductSpecification, cartProducts]);

  // Manejar cambio de especificación
  const handleSpecificationChange = (value: string) => {
    setSpecification(value);
    if (product && isInCart) {
      updateProductSpecification(product.productData.product_id, value);
    }
  };

  // Usar el estado completo de wishlist para que sea reactivo
  const wishlistProducts = useWishlist();
  const isInWishlist = product
    ? wishlistProducts.some(p => p.productData.product_id === product.productData.product_id)
    : false;

  const handleWishlistToggle = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

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
                        {product.productData?.price_details?.original_price && (
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
                      <button
                        onClick={handleWishlistToggle}
                        className={`tf-btn text-white ${isInWishlist ? 'btn-secondary' : 'btn-outline-primary'}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className={`icon-heart ${isInWishlist ? 'text-danger' : ''}`} style={{ fontSize: '18px' }} />
                        {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                      </button>
                      {/* <Link
                        href={`/shop-cart`}
                        className="tf-btn text-white btn-gray"
                      >
                        Buy now
                      </Link> */}
                    </div>
                    {/* Campo de especificación - Solo visible cuando el producto está en el carrito */}
                    {isInCart && (
                      <div className="product-specification" style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <label htmlFor="product-specification" className="body-md-2 fw-semibold" style={{ margin: 0 }}>
                            ¿Tienes alguna especificación?
                          </label>
                          <button
                            type="button"
                            aria-label="Más información sobre especificaciones"
                            style={{ position: 'relative', display: 'inline-block', background: 'none', border: 'none', padding: 0, cursor: 'help' }}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            onFocus={() => setShowTooltip(true)}
                            onBlur={() => setShowTooltip(false)}
                          >
                            <HelpCircle
                              size={18}
                              style={{ color: 'var(--primary)', cursor: 'help' }}
                            />
                            {showTooltip && (
                              <div
                                style={{
                                  position: 'absolute',
                                  bottom: '100%',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  backgroundColor: '#333',
                                  color: '#fff',
                                  padding: '10px 14px',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  width: '250px',
                                  textAlign: 'center',
                                  marginBottom: '8px',
                                  zIndex: 1000,
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                }}
                              >
                                Si necesitas una talla, color, medida o capacidad específica, escríbela aquí para que podamos conseguirla.
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    borderWidth: '6px',
                                    borderStyle: 'solid',
                                    borderColor: '#333 transparent transparent transparent'
                                  }}
                                />
                              </div>
                            )}
                          </button>
                        </div>
                        <textarea
                          id="product-specification"
                          value={specification}
                          onChange={(e) => handleSpecificationChange(e.target.value)}
                          placeholder="Ej: Talla M, Color azul, 500ml..."
                          style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    )}
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

