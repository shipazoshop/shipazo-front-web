"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/application/stores/useWishlistStore";
import { useProducts } from "@/shared/hooks/useProducts";
import { mapLegacyProductToImportProduct } from "@/domain/mappers/product.mapper";

interface WishlistProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  images: string[];
}

export default function WishlistDropdown() {
  const wishlistIds = useWishlist();
  const { products, isLoading } = useProducts();
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>([]);

  // Límite de productos a mostrar en el dropdown
  const MAX_DISPLAY_PRODUCTS = 6;

  useEffect(() => {
    if (!isLoading && products?.allProducts && wishlistIds.length > 0) {
      // Filtrar productos que están en la wishlist
      const filteredProducts = products.allProducts
        .filter((product: any) => wishlistIds.includes(product.id))
        .map((product: any) => {
          const importProduct = mapLegacyProductToImportProduct(product);
          return {
            id: importProduct.productData.product_id,
            title: importProduct.productData.title,
            price: importProduct.productData.price,
            currency: importProduct.productData.currency,
            images: importProduct.productData.images,
          };
        });

      setWishlistProducts(filteredProducts);
    } else if (wishlistIds.length === 0) {
      setWishlistProducts([]);
    }
  }, [wishlistIds, products, isLoading]);

  if (isLoading) {
    return (
      <div className="sub-menu-container mega-menu mega-home">
        <div className="container">
          <div className="text-center py-4">
            <p>Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

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
                <li key={product.id} className="demo-item">
                  <Link href={`/product-detail/${product.id}`}>
                    <div className="demo-image relative">
                      <Image
                        src={product.images[0] || "/images/product/default.jpg"}
                        alt={product.title}
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
                        {product.title}
                      </span>
                      <span className="price fw-semibold">
                        {product.currency} ${product.price.toFixed(2)}
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
