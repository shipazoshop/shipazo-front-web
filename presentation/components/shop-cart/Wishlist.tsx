"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWishlist, useWishlistActions } from "@/application/stores/useWishlistStore";
import { useAddProductToCart, useCartProducts } from "@/application/stores/useCartStore";
import { useProductStore } from "@/application/state/product";
import { IImportProductResponse } from "@/domain/dto/import-product.dto";
import { Search, X, ShoppingCart, Trash2 } from "lucide-react";

export default function Wishlist() {
  const wishlistProducts = useWishlist();
  const { removeFromWishlist } = useWishlistActions();
  const addProductToCart = useAddProductToCart();
  const cartProducts = useCartProducts();
  const { setProduct } = useProductStore();
  const router = useRouter();

  const handleProductClick = (product: IImportProductResponse) => {
    setProduct(product);
    router.push(`/product-detail/${product.productData.product_id}?url=${encodeURIComponent(product.url)}`);
  };

  const isInCart = (id: string) => cartProducts.some((p) => p.productData.product_id === id);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  // Extraer tiendas únicas del wishlist
  const stores = useMemo(() => {
    const storeSet = new Set<string>();
    wishlistProducts.forEach((p) => {
      if (p.store) storeSet.add(p.store);
    });
    return Array.from(storeSet).sort();
  }, [wishlistProducts]);

  const toggleStore = (store: string) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  const clearFilters = () => {
    setSelectedStores([]);
    setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    return wishlistProducts.filter((p) => {
      const matchesSearch = p.productData.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStore =
        selectedStores.length === 0 ||
        selectedStores.includes(p.store ?? "");
      return matchesSearch && matchesStore;
    });
  }, [wishlistProducts, searchQuery, selectedStores]);

  const hasActiveFilters = selectedStores.length > 0 || searchQuery.length > 0;

  if (wishlistProducts.length === 0) {
    return (
      <div className="tf-sp-2">
        <div className="container">
          <div className="wl-empty">
            <p className="wl-empty__text">
              Tu wishlist está vacía. ¡Empieza a agregar tus productos favoritos!
            </p>
            <Link className="tf-btn btn-fill animate-hover-btn mt-3" href="/home">
              <span>Explorar productos</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tf-sp-2">
      <div className="container">
        <div className="wl-wrap">

          {/* ── Barra de búsqueda ── */}
          <div className="wl-search-bar">
            <Search size={16} className="wl-search-bar__icon" />
            <input
              type="text"
              className="wl-search-bar__input"
              placeholder="Buscar por nombre de artículo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="wl-search-bar__clear"
                onClick={() => setSearchQuery("")}
                aria-label="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* ── Filtros por tienda ── */}
          {stores.length > 0 && (
            <div className="wl-filters">
              {stores.map((store) => (
                <button
                  key={store}
                  className={`wl-filters__chip${selectedStores.includes(store) ? " wl-filters__chip--active" : ""}`}
                  onClick={() => toggleStore(store)}
                >
                  {store}
                  {selectedStores.includes(store) && (
                    <X size={11} className="wl-filters__chip-x" />
                  )}
                </button>
              ))}
              {hasActiveFilters && (
                <button className="wl-filters__clear" onClick={clearFilters}>
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {/* ── Contador ── */}
          <p className="wl-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
            {hasActiveFilters && " encontrados"}
          </p>

          {/* ── Lista ── */}
          {filteredProducts.length === 0 ? (
            <div className="wl-no-results">
              <p>No se encontraron productos con los filtros aplicados.</p>
              <button className="wl-filters__clear mt-2" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="wl-list">
              {filteredProducts.map((product, i) => {
                const inCart = isInCart(product.productData.product_id);
                const price =
                  product.productData.price_details?.calculatedPriceGtq?.toFixed(2) ??
                  product.productData.price.toFixed(2);
                return (
                  <div key={product.url + product.productData.product_id} className="wl-item">
                    {/* Imagen */}
                    <button
                      type="button"
                      onClick={() => handleProductClick(product)}
                      className="wl-item__img-wrap"
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      <Image
                        src={product.productData.images?.[0] || "/images/product/default.jpg"}
                        alt={product.productData.title}
                        width={92}
                        height={92}
                        className="wl-item__img"
                        style={{ objectFit: "cover" }}
                      />
                    </button>

                    {/* Info */}
                    <div className="wl-item__info">
                      <button
                        type="button"
                        onClick={() => handleProductClick(product)}
                        className="wl-item__title"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                      >
                        {product.productData.title}
                      </button>
                      {product.store && (
                        <span className="wl-item__store">{product.store}</span>
                      )}
                      <span className="wl-item__price">Q{price}</span>
                      <button
                        className={`wl-item__cart-btn${inCart ? " wl-item__cart-btn--added" : ""}`}
                        onClick={() => !inCart && addProductToCart(product)}
                        style={{ justifyContent: "center" }}
                      >
                        <ShoppingCart size={15} />
                        <span>
                          {inCart ? "Producto agregado al carrito" : "Agregar al carrito"}
                        </span>
                      </button>
                    </div>

                    {/* Acciones */}
                    <div className="wl-item__right">
                      <div className="wl-item__actions">
                        <button
                          className="wl-item__remove"
                          onClick={() => removeFromWishlist(product.productData.product_id)}
                          aria-label="Eliminar de wishlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
