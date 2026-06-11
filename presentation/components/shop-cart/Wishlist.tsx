"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist, useWishlistActions } from "@/application/stores/useWishlistStore";
import { useAddProductToCart, useCartProducts } from "@/application/stores/useCartStore";
import { useProductStore } from "@/application/state/product";
import type { IImportProductResponse } from "@/domain/dto/import-product.dto";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtGtq(n: number) {
  return n.toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtUsd(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function storePillOrange(store: string) {
  return store.toLowerCase().includes("amazon");
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Wishlist() {
  const wishlistProducts = useWishlist();
  const { removeFromWishlist } = useWishlistActions();
  const addProductToCart = useAddProductToCart();
  const cartProducts = useCartProducts();
  const { setProduct } = useProductStore();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  const stores = useMemo(() => {
    const set = new Set<string>();
    wishlistProducts.forEach((p) => { if (p.store) set.add(p.store); });
    return Array.from(set).sort();
  }, [wishlistProducts]);

  const toggleStore = (store: string) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  const filteredProducts = useMemo(() =>
    wishlistProducts.filter((p) => {
      const matchSearch = p.productData.title.toLowerCase().includes(search.toLowerCase());
      const matchStore = selectedStores.length === 0 || selectedStores.includes(p.store ?? "");
      return matchSearch && matchStore;
    }),
  [wishlistProducts, search, selectedStores]);

  const isInCart = (id: string) => cartProducts.some((p) => p.productData.product_id === id);

  const totalGtq = useMemo(() =>
    wishlistProducts.reduce((acc, p) =>
      acc + (p.productData.price_details?.calculatedPriceGtq ?? p.productData.price), 0),
  [wishlistProducts]);

  const handleGoToProduct = (product: IImportProductResponse) => {
    setProduct(product);
    router.push(`/product-detail/${product.productData.product_id}?url=${encodeURIComponent(product.url)}`);
  };

  const handleAddAll = () => {
    wishlistProducts.forEach((p) => {
      if (!isInCart(p.productData.product_id)) {
        addProductToCart(p, 1, false);
      }
    });
  };

  // ── Empty state ────────────────────────────────────────────────────────────
  if (wishlistProducts.length === 0) {
    return (
      <main className="wlv8-page">
        <div className="wlv8-empty">
          <div className="wlv8-empty-ico">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.4">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
          </div>
          <h2 className="wlv8-empty-title">Tu wishlist está vacía</h2>
          <p className="wlv8-empty-sub">¡Pega el link de un producto y empieza a guardar tus favoritos!</p>
          <Link href="/home" className="wlv8-btn-primary">
            Explorar productos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </main>
    );
  }

  // ── Full page ──────────────────────────────────────────────────────────────
  return (
    <main className="wlv8-page">
      <div className="wlv8-inner">

        {/* Breadcrumb */}
        <nav className="wlv8-breadcrumb">
          <Link href="/home">Inicio</Link>
          <span className="wlv8-bc-sep">/</span>
          <span className="wlv8-bc-cur">Mi Wishlist</span>
        </nav>

        {/* Page head */}
        <div className="wlv8-head">
          <div className="wlv8-head-ico">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.4">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
          </div>
          <div>
            <h1 className="wlv8-head-title">Mi Wishlist</h1>
            <p className="wlv8-head-sub">Los productos que estás considerando comprar. Cuando estés listo, agrégalos al carrito en un clic.</p>
          </div>
          <div className="wlv8-head-right">
            <button className="wlv8-btn-primary" onClick={handleAddAll}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
              Agregar todo al carrito
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="wlv8-stats">
          <div className="wlv8-stat">
            <div className="wlv8-stat-ico wlv8-stat-ico--orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
              </svg>
            </div>
            <div>
              <div className="wlv8-stat-val">{wishlistProducts.length}</div>
              <div className="wlv8-stat-lbl">Productos guardados</div>
            </div>
          </div>
          <div className="wlv8-stat">
            <div className="wlv8-stat-ico wlv8-stat-ico--purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div>
              <div className="wlv8-stat-val">Q {fmtGtq(totalGtq)}</div>
              <div className="wlv8-stat-lbl">Total estimado</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="wlv8-filters">
          {/* Search */}
          <div className="wlv8-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
            <input
              type="text"
              placeholder="Buscar por nombre de artículo…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Store chips */}
          {stores.length > 0 && (
            <div className="wlv8-store-chips">
              {stores.map((store) => {
                const count = wishlistProducts.filter((p) => p.store === store).length;
                const active = selectedStores.includes(store);
                return (
                  <button
                    key={store}
                    className={`wlv8-chip${active ? " wlv8-chip--active" : ""}`}
                    onClick={() => toggleStore(store)}
                  >
                    {store}
                    <span className="wlv8-chip-count">{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Items */}
        {filteredProducts.length === 0 ? (
          <div className="wlv8-no-results">
            <p>No se encontraron productos con los filtros aplicados.</p>
            <button className="wlv8-clear-link" onClick={() => { setSearch(""); setSelectedStores([]); }}>
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="wlv8-list">
            {filteredProducts.map((product) => {
              const pd = product.productData;
              const gtq = pd.price_details?.calculatedPriceGtq ?? pd.price;
              const usd = pd.price_details?.priceBreakdown?.priceUsd ?? pd.price;
              const inCart = isInCart(pd.product_id);
              const isAmazon = storePillOrange(product.store ?? "");
              const imgSrc = pd.images?.[0] || "/images/logo/favicon-shipazo.webp";

              return (
                <article key={product.url + pd.product_id} className="wlv8-item">
                  {/* Image */}
                  <button
                    type="button"
                    className="wlv8-img"
                    onClick={() => handleGoToProduct(product)}
                    aria-label={`Ver ${pd.title}`}
                  >
                    <Image
                      src={imgSrc}
                      alt={pd.title}
                      fill
                      sizes="120px"
                      style={{ objectFit: "contain" }}
                    />
                  </button>

                  {/* Info */}
                  <div className="wlv8-info">
                    <div className="wlv8-info-top">
                      {product.store && (
                        <span className={`wlv8-brand-pill${isAmazon ? " wlv8-brand-pill--orange" : ""}`}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            {isAmazon
                              ? <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                              : <circle cx="12" cy="12" r="10"/>}
                          </svg>
                          {product.store}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="wlv8-title"
                      onClick={() => handleGoToProduct(product)}
                    >
                      {pd.title}
                    </button>

                    <div className="wlv8-price-row">
                      <span className="wlv8-price-main">
                        <span className="wlv8-price-sym">Q</span>
                        {" "}{fmtGtq(gtq)}
                      </span>
                      <span className="wlv8-price-usd">≈ US$ {fmtUsd(usd)}</span>
                      <span className="wlv8-delivery">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><path d="m16 8 4 0 3 3-2 5h-5l-3-3"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                        Llega en <strong>7-9 días</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="wlv8-actions">
                    <button
                      className={`wlv8-btn-add${inCart ? " wlv8-btn-add--done" : ""}`}
                      onClick={() => !inCart && addProductToCart(product, 1, false)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
                      {inCart ? "En tu carrito" : "Agregar al carrito"}
                    </button>
                    <div className="wlv8-btn-row">
                      <button
                        className="wlv8-btn-icon"
                        onClick={() => handleGoToProduct(product)}
                        title="Ver detalles"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
                        Ver
                      </button>
                      <button
                        className="wlv8-btn-icon wlv8-btn-icon--danger"
                        onClick={() => removeFromWishlist(pd.product_id)}
                        title="Quitar de wishlist"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Browse more CTA */}
        <div className="wlv8-browse-more">
          <h3>¿Buscando algo más?</h3>
          <p>Pega cualquier link de Amazon, Shein, AliExpress o eBay y lo agregamos a tu wishlist.</p>
          <Link href="/home" className="wlv8-browse-cta">
            Explorar productos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>

      </div>

      <style>{`
        /* ── Page wrapper ── */
        .wlv8-page {
          background: #F7F4EF;
          min-height: calc(100vh - 68px);
        }
        .wlv8-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px 80px;
        }

        /* ── Breadcrumb ── */
        .wlv8-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 20px 0 6px;
          font-size: 13px;
          color: #8A7D96;
        }
        .wlv8-breadcrumb a { color: #8A7D96; text-decoration: none; }
        .wlv8-breadcrumb a:hover { color: #DC6F34; }
        .wlv8-bc-sep { color: #D8D0C4; }
        .wlv8-bc-cur { color: #1A0D24; font-weight: 600; }

        /* ── Page head ── */
        .wlv8-head {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          margin: 8px 0 28px;
        }
        .wlv8-head-ico {
          width: 56px; height: 56px;
          border-radius: 16px;
          background: #FDF4ED;
          color: #DC6F34;
          border: 1px solid rgba(220,111,52,0.18);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wlv8-head-title {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 34px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #1A0D24;
          margin: 0;
          line-height: 1.02;
        }
        .wlv8-head-sub {
          font-size: 14px;
          color: #8A7D96;
          margin: 6px 0 0;
          max-width: 520px;
          line-height: 1.45;
        }
        .wlv8-head-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        /* ── Primary button ── */
        .wlv8-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 18px;
          border-radius: 12px;
          background: #DC6F34;
          color: white;
          border: 0;
          font-size: 13.5px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 8px 20px -8px rgba(220,111,52,0.5);
          transition: background 0.2s, transform 0.2s;
        }
        .wlv8-btn-primary:hover { background: #c4612e; transform: translateY(-1px); }

        /* ── Stats ── */
        .wlv8-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 22px;
        }
        .wlv8-stat {
          background: white;
          border: 1px solid #ECE5DC;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .wlv8-stat-ico {
          width: 42px; height: 42px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wlv8-stat-ico--orange { background: #FDF4ED; color: #DC6F34; }
        .wlv8-stat-ico--purple { background: #F4F0F8; color: #562B7F; }
        .wlv8-stat-val {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 20px;
          color: #1A0D24;
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .wlv8-stat-lbl {
          font-size: 11.5px;
          color: #8A7D96;
          margin-top: 4px;
          font-weight: 600;
        }

        /* ── Filters ── */
        .wlv8-filters {
          background: white;
          border: 1px solid #ECE5DC;
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .wlv8-search {
          flex: 1;
          min-width: 240px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FAF7F2;
          border: 1.5px solid #ECE5DC;
          border-radius: 12px;
          padding: 10px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .wlv8-search:focus-within {
          background: white;
          border-color: #DC6F34;
          box-shadow: 0 0 0 3px rgba(220,111,52,0.1);
        }
        .wlv8-search svg { color: #8A7D96; flex-shrink: 0; }
        .wlv8-search input {
          border: 0; outline: 0; background: transparent;
          font-family: inherit;
          font-size: 14px;
          color: #1A0D24;
          width: 100%;
        }
        .wlv8-search input::placeholder { color: #8A7D96; }

        .wlv8-store-chips { display: flex; gap: 8px; flex-wrap: wrap; }
        .wlv8-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          color: #4A3D57;
          background: #FAF7F2;
          border: 1px solid #ECE5DC;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .wlv8-chip:hover { color: #1A0D24; border-color: #D8D0C4; }
        .wlv8-chip--active { background: #1A0D24; color: white; border-color: #1A0D24; }
        .wlv8-chip-count { font-size: 11px; opacity: 0.65; font-weight: 600; }
        .wlv8-chip--active .wlv8-chip-count { opacity: 0.7; }

        /* ── No results ── */
        .wlv8-no-results {
          text-align: center;
          padding: 48px 24px;
          color: #8A7D96;
          font-size: 14px;
        }
        .wlv8-clear-link {
          background: none;
          border: none;
          color: #DC6F34;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          margin-top: 8px;
        }
        .wlv8-clear-link:hover { text-decoration: underline; }

        /* ── List ── */
        .wlv8-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* ── Item ── */
        .wlv8-item {
          background: white;
          border: 1px solid #ECE5DC;
          border-radius: 18px;
          padding: 16px;
          display: grid;
          grid-template-columns: 120px 1fr auto;
          gap: 20px;
          align-items: center;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .wlv8-item:hover {
          border-color: rgba(220,111,52,0.4);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -16px rgba(20,7,31,0.18);
        }

        /* Image */
        .wlv8-img {
          width: 120px;
          height: 120px;
          border-radius: 14px;
          background: #FAF7F2;
          border: 1px solid #ECE5DC;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
        }

        /* Info */
        .wlv8-info { min-width: 0; }
        .wlv8-info-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .wlv8-brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          background: #F4F0F8;
          color: #562B7F;
          border: 1px solid rgba(86,43,127,0.18);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .wlv8-brand-pill--orange {
          background: #FDF4ED;
          color: #DC6F34;
          border-color: rgba(220,111,52,0.22);
        }
        .wlv8-title {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-size: 15px;
          font-weight: 700;
          color: #1A0D24;
          line-height: 1.4;
          margin: 0 0 8px;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          width: 100%;
        }
        .wlv8-title:hover { color: #DC6F34; }

        .wlv8-price-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 4px;
        }
        .wlv8-price-main {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 22px;
          color: #1A0D24;
          letter-spacing: -0.015em;
          line-height: 1;
        }
        .wlv8-price-sym { color: #DC6F34; }
        .wlv8-price-usd { font-size: 12px; color: #8A7D96; font-weight: 600; }
        .wlv8-delivery {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #8A7D96;
          margin-left: auto;
        }
        .wlv8-delivery svg { color: #DC6F34; }
        .wlv8-delivery strong { color: #1A0D24; font-weight: 700; }

        /* Actions */
        .wlv8-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 200px;
          flex-shrink: 0;
        }
        .wlv8-btn-add {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 18px;
          background: #DC6F34;
          color: white;
          border: 0;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          box-shadow: 0 8px 18px -8px rgba(220,111,52,0.5);
          transition: background 0.2s, transform 0.2s;
          width: 100%;
        }
        .wlv8-btn-add:hover { background: #c4612e; transform: translateY(-1px); }
        .wlv8-btn-add--done {
          background: #FAF7F2;
          color: #8A7D96;
          box-shadow: none;
          border: 1.5px solid #ECE5DC;
          cursor: default;
        }
        .wlv8-btn-add--done:hover { background: #FAF7F2; transform: none; }

        .wlv8-btn-row { display: flex; gap: 6px; }
        .wlv8-btn-icon {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 10px;
          background: white;
          border: 1.5px solid #ECE5DC;
          border-radius: 10px;
          color: #4A3D57;
          font-size: 12px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .wlv8-btn-icon:hover { border-color: #DC6F34; color: #DC6F34; background: #FDF4ED; }
        .wlv8-btn-icon--danger:hover { border-color: #B0395A; color: #B0395A; background: #FBEDF1; }

        /* ── Browse more ── */
        .wlv8-browse-more {
          margin-top: 28px;
          text-align: center;
          padding: 36px 24px;
          background: linear-gradient(180deg, white 0%, #F4F0F8 100%);
          border: 1px dashed rgba(86,43,127,0.25);
          border-radius: 20px;
        }
        .wlv8-browse-more h3 {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 20px;
          color: #1A0D24;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .wlv8-browse-more p {
          font-size: 13.5px;
          color: #8A7D96;
          margin: 0 0 18px;
        }
        .wlv8-browse-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: #1A0D24;
          color: white;
          border-radius: 12px;
          border: 0;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .wlv8-browse-cta:hover { background: #562B7F; transform: translateY(-1px); }

        /* ── Empty state ── */
        .wlv8-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 100px 24px;
          text-align: center;
        }
        .wlv8-empty-ico {
          width: 72px; height: 72px;
          border-radius: 20px;
          background: #FDF4ED;
          color: #DC6F34;
          border: 1px solid rgba(220,111,52,0.18);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .wlv8-empty-title {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 24px;
          color: #1A0D24;
          margin: 0;
        }
        .wlv8-empty-sub {
          font-size: 14px;
          color: #8A7D96;
          margin: 0;
          max-width: 380px;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .wlv8-inner { padding: 0 18px 60px; }
          .wlv8-head { flex-wrap: wrap; }
          .wlv8-head-right { width: 100%; }
          .wlv8-head-right .wlv8-btn-primary { width: 100%; justify-content: center; }
          .wlv8-stats { grid-template-columns: 1fr 1fr; }
          .wlv8-item { grid-template-columns: 100px 1fr; }
          .wlv8-actions { grid-column: 1 / -1; width: 100%; flex-direction: row; }
          .wlv8-btn-add { flex: 2; }
          .wlv8-btn-row { flex: 1; }
        }

        @media (max-width: 600px) {
          .wlv8-head-title { font-size: 26px; }
          .wlv8-stats { grid-template-columns: 1fr; }
          .wlv8-item { grid-template-columns: 90px 1fr; gap: 14px; }
          .wlv8-img { width: 90px; height: 90px; }
          .wlv8-price-main { font-size: 18px; }
          .wlv8-delivery { display: none; }
        }
      `}</style>
    </main>
  );
}
