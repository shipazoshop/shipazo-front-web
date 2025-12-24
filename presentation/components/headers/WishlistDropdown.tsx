"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/application/stores/useWishlistStore";

export default function WishlistDropdown() {
  const wishlistProducts = useWishlist();

  // Límite de productos a mostrar en el dropdown
  const MAX_DISPLAY_PRODUCTS = 6;

  if (wishlistProducts.length === 0) {
    return (
      <div className="sub-menu-container mega-menu mega-home">
        <div className="container">
          <div className="text-center py-4">
            <p>No hay productos en tu wishlist</p>
          </div>
        </div>
      </div>
    );
  }

  const hasMoreProducts = wishlistProducts.length > MAX_DISPLAY_PRODUCTS;
  const displayedProducts = wishlistProducts.slice(0, MAX_DISPLAY_PRODUCTS);

  return (
    <div className="sub-menu-container mega-menu mega-home">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ul className="row-demo" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {displayedProducts.map((product) => (
                <li key={product.productData.product_id} className="demo-item">
                  <Link href={`/product-detail/${product.productData.product_id}?url=${product.url}`}>
                    <div className="demo-image relative">
                      <Image
                        src={product.productData.images?.[0] || "/images/product/default.jpg"}
                        alt={product.productData.title}
                        className="lazyload"
                        width={273}
                        height={300}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="demo-content mt-2">
                      <span className="demo-name" style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '0.5rem'
                      }}>
                        {product.productData.title.length > 20
                          ? `${product.productData.title.substring(0, 20)}...`
                          : product.productData.title}
                      </span>
                      <span className="price fw-semibold">
                        {product.productData.currency} ${product.productData.price.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {hasMoreProducts && (
              <div className="text-center mt-3 mb-2">
                <Link href="/wishlist" className="body-md-2 link text-decoration-underline">
                  Ver todos ({wishlistProducts.length} productos)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
