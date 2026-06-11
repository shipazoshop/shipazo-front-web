"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IImportProductResponse } from "../../../domain/dto/import-product.dto";
import { LoadingScreen } from "../common/LoadingScreen";
import { useCartActions, useCartProducts } from "@/application/stores/useCartStore";
import { useWishlistActions, useWishlist } from "@/application/stores/useWishlistStore";
import ProductGalleryV8 from "./ProductGalleryV8";

// ── Helpers ──────────────────────────────────────────────────────────────
function fmt(n: number | null | undefined, decimals = 2): string {
  if (n == null) return "—";
  return n.toLocaleString("es-GT", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function InfoBtn({ title }: { title: string }) {
  return (
    <span className="pd2-info-btn" title={title}>i</span>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function Details2({ product }: Readonly<{ product: IImportProductResponse }>) {
  const [quantity, setQuantity] = useState(1);
  const [specification, setSpecification] = useState("");
  const [descExpanded, setDescExpanded] = useState(false);

  const { addProductToCart, isAddedToCartProducts, getProductSpecification, updateProductSpecification } = useCartActions();
  const { toggleWishlist } = useWishlistActions();
  const cartProducts = useCartProducts();
  const wishlistProducts = useWishlist();

  const isInCart = product ? isAddedToCartProducts(product.productData.product_id) : false;
  const isInWishlist = product
    ? wishlistProducts.some(p => p.productData.product_id === product.productData.product_id)
    : false;

  useEffect(() => {
    if (isInCart && product) {
      const saved = getProductSpecification(product.productData.product_id);
      if (saved) setSpecification(saved);
    }
  }, [isInCart, product, getProductSpecification, cartProducts]);

  useEffect(() => {
    if (isInCart && product && specification) {
      updateProductSpecification(product.productData.product_id, specification);
    }
  }, [isInCart]);

  const handleSpecChange = (val: string) => {
    setSpecification(val);
    if (product && isInCart) {
      updateProductSpecification(product.productData.product_id, val);
    }
  };

  if (!product) return <LoadingScreen show />;

  const pd = product.productData;
  const pb = pd.price_details?.priceBreakdown;
  const totalGtq = pd.price_details?.calculatedPriceGtq;

  // Build description paragraphs (split by double newline or single newline)
  const descParagraphs = (pd.description ?? "")
    .split(/\n\n|\n/)
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="pd2-breadcrumb">
        <Link href="/home" className="pd2-bc-link">Inicio</Link>
        <span className="pd2-bc-sep">/</span>
        {pd.categoria && (
          <>
            <span className="pd2-bc-link">{pd.categoria}</span>
            <span className="pd2-bc-sep">/</span>
          </>
        )}
        <span className="pd2-bc-current">{pd.title?.slice(0, 60)}{pd.title?.length > 60 ? "…" : ""}</span>
      </div>

      {/* ── Product stage ── */}
      <main className="pd2-stage">

        {/* Col 1: gallery */}
        <div className="pd2-gallery-col">
          <ProductGalleryV8 images={pd.images ?? []} />
        </div>

        {/* Col 2: info */}
        <section className="pd2-info">

          {/* Brand row */}
          <div className="pd2-brand-row">
            {pd.brand && (
              <span className="pd2-brand">
                <span className="pd2-brand-logo">{pd.brand.charAt(0).toUpperCase()}</span>
                <span className="pd2-brand-label">
                  {pd.brand}
                  <small>Tienda</small>
                </span>
              </span>
            )}
            {pd.categoria && (
              <span className="pd2-category">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                {pd.categoria}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="pd2-title">{pd.title ?? ""}</h1>

          {/* Price block */}
          <div className="pd2-price-block">
            {totalGtq ? (
              <>
                <div className="pd2-price-row">
                  <span className="pd2-price-main">
                    <span className="pd2-price-sym">Q</span>
                    {fmt(totalGtq)}
                  </span>
                  {pb?.priceUsd && (
                    <span className="pd2-price-usd">≈ US$ {fmt(pb.priceUsd)}</span>
                  )}
                </div>
                <div className="pd2-price-meta">
                  <span><b>Pagas en quetzales</b> · sin tarjeta internacional</span>
                </div>
              </>
            ) : pb?.priceUsd ? (
              <div className="pd2-price-row">
                <span className="pd2-price-main">
                  <span className="pd2-price-sym">US$</span>{fmt(pb.priceUsd)}
                </span>
              </div>
            ) : null}
          </div>

          {/* Specs grid: only available fields */}
          {(pd.dimensions || pd.weight || pd.calculated_weight) && (
            <div className="pd2-specs">
              {pd.dimensions && (
                <div className="pd2-spec">
                  <div className="pd2-spec-lbl">Dimensiones</div>
                  <div className="pd2-spec-val">{pd.dimensions}</div>
                </div>
              )}
              {(pd.weight || pd.calculated_weight) && (
                <div className="pd2-spec">
                  <div className="pd2-spec-lbl">Peso</div>
                  <div className="pd2-spec-val">{pd.weight ?? pd.calculated_weight}</div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {descParagraphs.length > 0 && (
            <div className="pd2-desc-section">
              <div className="pd2-sect-head">
                <h2 className="pd2-sect-title">Sobre el producto</h2>
                <span className="pd2-sect-meta">Descripción del proveedor</span>
              </div>
              <div className={`pd2-desc-body ${descExpanded ? "pd2-desc-expanded" : "pd2-desc-collapsed"}`}>
                {descParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <button
                className={`pd2-desc-toggle ${descExpanded ? "pd2-desc-open" : ""}`}
                onClick={() => setDescExpanded(v => !v)}
              >
                <span>{descExpanded ? "Mostrar menos" : "Leer descripción completa"}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          )}

          {/* Price breakdown */}
          {pb && totalGtq && (
            <div className="pd2-breakdown">
              <div className="pd2-bd-head">
                <div>
                  <h3 className="pd2-bd-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Desglose transparente de precio
                  </h3>
                  <div className="pd2-bd-tagline">Te mostramos cada centavo. Sin sorpresas.</div>
                </div>
                <div className="pd2-bd-head-right">
                  <div className="pd2-bd-total-top">
                    <span className="pd2-bd-sym">Q</span> {fmt(totalGtq)}
                  </div>
                  {pb.priceUsd && pb.exchangeRate && (
                    <small>≈ US$ {fmt(pb.priceUsd)} · TC {pb.exchangeRate.toFixed(5)}</small>
                  )}
                </div>
              </div>

              {/* Group: Producto en origen */}
              <div className="pd2-bd-group">
                <div className="pd2-bd-group-label">Producto en origen</div>
                {pb.baseGtq > 0 && (
                  <div className="pd2-bd-line">
                    <span className="pd2-bd-label">
                      Precio en tienda <InfoBtn title="Precio publicado en la tienda original" />
                    </span>
                    <span className="pd2-bd-value">
                      Q {fmt(pb.baseGtq)}
                      {pb.priceUsd && <span className="pd2-bd-usd">US$ {fmt(pb.priceUsd)}</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Group: Logística */}
              <div className="pd2-bd-group">
                <div className="pd2-bd-group-label">Logística internacional</div>
                <div className="pd2-bd-line">
                  <span className="pd2-bd-label">
                    Envío internacional
                    {pb.weightLb > 0 && <InfoBtn title={`Calculado por peso (${pb.weightLb.toFixed(2)} lb)`} />}
                  </span>
                  <span className="pd2-bd-value">Q {fmt(pb.shippingCost)}</span>
                </div>
                <div className="pd2-bd-line">
                  <span className="pd2-bd-label">Seguro de envío</span>
                  <span className="pd2-bd-value">Q {fmt(pb.insuranceCost)}</span>
                </div>
              </div>

              {/* Group: Aduanas */}
              <div className="pd2-bd-group">
                <div className="pd2-bd-group-label">Aduanas e impuestos</div>
                <div className="pd2-bd-line">
                  <span className="pd2-bd-label">
                    DAI <small className="pd2-bd-small">(arancel · {pb.daiPercentage}%)</small>
                    <InfoBtn title="Derechos arancelarios a la importación" />
                  </span>
                  <span className="pd2-bd-value">Q {fmt(pb.dai)}</span>
                </div>
                <div className="pd2-bd-line">
                  <span className="pd2-bd-label">
                    IVA <small className="pd2-bd-small">({pb.ivaPercentage}%)</small>
                  </span>
                  <span className="pd2-bd-value">Q {fmt(pb.iva)}</span>
                </div>
                <div className="pd2-bd-line">
                  <span className="pd2-bd-label">
                    Gestión aduanal <InfoBtn title="Trámites y desaduanaje" />
                  </span>
                  <span className="pd2-bd-value">Q {fmt(pb.clearanceCost)}</span>
                </div>
              </div>

              {/* Group: Servicio Shipazo */}
              <div className="pd2-bd-group">
                <div className="pd2-bd-group-label">Servicio Shipazo</div>
                <div className="pd2-bd-line">
                  <span className="pd2-bd-label">
                    Compra, manejo y entrega a domicilio
                    <InfoBtn title="Incluye compra en origen, almacenaje, manejo y entrega final" />
                  </span>
                  <span className="pd2-bd-value">Q {fmt(pb.calshopServiceFee)}</span>
                </div>
                <div className="pd2-bd-line">
                  <span className="pd2-bd-label">
                    Comisión de pago <InfoBtn title="Procesamiento del pago local" />
                  </span>
                  <span className="pd2-bd-value">Q {fmt(pb.paymentFee)}</span>
                </div>
              </div>

              {/* Total row */}
              <div className="pd2-bd-total">
                <div className="pd2-bd-total-l">
                  Total a pagar
                  <small>Precio final · todo incluido</small>
                </div>
                <div className="pd2-bd-total-v">
                  Q {fmt(totalGtq)}
                  {pb.priceUsd && <small>US$ {fmt(pb.priceUsd)}</small>}
                </div>
              </div>

              <div className="pd2-bd-foot">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" />
                </svg>
                <span><b>Precio bloqueado al confirmar tu compra.</b> Si los impuestos reales son menores, te devolvemos la diferencia.</span>
              </div>
            </div>
          )}
        </section>

        {/* Col 3: purchase card (sticky) */}
        <aside className="pd2-buy-col">
          <div className="pd2-buy">
            {/* Price */}
            <div className="pd2-buy-price">
              <span className="pd2-buy-cur">
                <span className="pd2-buy-sym">Q</span>
                {totalGtq ? fmt(totalGtq) : pb?.priceUsd ? `US$ ${fmt(pb.priceUsd)}` : "—"}
              </span>
              {totalGtq && pb?.priceUsd && (
                <span className="pd2-buy-usd">≈ US$ {fmt(pb.priceUsd)}</span>
              )}
            </div>

            {/* Buy rows */}
            {pb?.shippingCost != null && (
              <div className="pd2-buy-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" /><path d="m16 8 4 0 3 3-2 5h-5l-3-3" />
                  <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>Envío internacional: <b>Q {fmt(pb.shippingCost)}</b></span>
              </div>
            )}
            <div className="pd2-buy-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              </svg>
              <span><b>Compra asegurada</b> 100% protegida</span>
            </div>

            {/* Delivery estimate */}
            <div className="pd2-buy-delivery">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" /><path d="m16 8 4 0 3 3-2 5h-5l-3-3" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>
                <b>Entrega estimada: 7-9 días hábiles</b>
                <br /><span className="pd2-delivery-sub">Desde que confirmes tu compra</span>
              </span>
            </div>

            {/* Quantity */}
            <div className="pd2-qty-block">
              <span className="pd2-qty-lbl">Cantidad</span>
              <div className="pd2-qty">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Quitar">−</button>
                <span className="pd2-qty-val">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} aria-label="Agregar">+</button>
              </div>
              {pd.stock && (
                <span className="pd2-stock">
                  <span className="pd2-stock-dot" />En stock
                </span>
              )}
            </div>

            {/* CTA buttons */}
            <a
              href="#shoppingCart"
              data-bs-toggle="offcanvas"
              className={`pd2-btn-buy ${isInCart ? "pd2-btn-buy-added" : ""}`}
              onClick={() => addProductToCart(product, quantity)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
              {isInCart ? "En el carrito" : "Agregar al carrito"}
            </a>

            <button
              onClick={() => product && toggleWishlist(product)}
              className={`pd2-btn-wish ${isInWishlist ? "pd2-btn-wish-active" : ""}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
              </svg>
              {isInWishlist ? "Guardado en favoritos" : "Guardar en favoritos"}
            </button>

            {/* Trust items */}
            <div className="pd2-buy-trust">
              <div className="pd2-trust-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" />
                </svg>
                <span><b>Compra asegurada</b> — devolución sin costo</span>
              </div>
              <div className="pd2-trust-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span><b>Tracking en tiempo real</b> · avisos por WhatsApp</span>
              </div>
              <div className="pd2-trust-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M16 12h-4V8" />
                </svg>
                <span><b>Soporte 24/7</b> en español</span>
              </div>
            </div>
          </div>

          {/* Spec request card */}
          <div className="pd2-spec-request">
            <div className="pd2-spec-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              ¿Tienes alguna especificación?
            </div>
            <p className="pd2-spec-desc">
              Cuéntanos qué versión, talla o color necesitas. Nuestro equipo lo confirma antes de comprar.
            </p>
            <textarea
              value={specification}
              onChange={e => handleSpecChange(e.target.value)}
              placeholder="Ej: Talla M · Color azul · 500ml · Versión PC…"
              className="pd2-spec-textarea"
            />
          </div>
        </aside>
      </main>

      {/* ── Trust strip ── */}
      <section className="pd2-trust-strip">
        <div className="pd2-trust-inner">
          {[
            {
              icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" /></svg>),
              cls: "orange",
              title: "Envío Express internacional",
              desc: "Tu compra cruza el mundo en 7-9 días con rutas optimizadas.",
            },
            {
              icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>),
              cls: "purple",
              title: "Tracking en tiempo real",
              desc: "Sigue cada paso y recibe avisos por WhatsApp.",
            },
            {
              icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>),
              cls: "orange",
              title: "Compra 100% asegurada",
              desc: "Protección total contra imprevistos en el envío.",
            },
            {
              icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 18a9 9 0 0 1 18 0" /><path d="M21 19a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z" /><path d="M3 19a2 2 0 0 0 2 2h1v-6h-1a2 2 0 0 0-2 2z" /></svg>),
              cls: "purple",
              title: "Soporte 24/7 en español",
              desc: "Te respondemos por WhatsApp en menos de 5 minutos.",
            },
          ].map((t) => (
            <div key={t.title} className="pd2-trust-card">
              <div className={`pd2-t-ico pd2-t-ico-${t.cls}`}>{t.icon}</div>
              <div>
                <h4 className="pd2-t-title">{t.title}</h4>
                <p className="pd2-t-desc">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Styles ── */}
      <style>{`
        /* ── Variables ── */
        :root {
          --pd2-orange: #DC6F34;
          --pd2-orange-soft: #F4A261;
          --pd2-orange-tint: #FDF4ED;
          --pd2-purple: #562B7F;
          --pd2-purple-light: #6A3A99;
          --pd2-purple-tint: #F4F0F8;
          --pd2-ink: #1A0D24;
          --pd2-ink-soft: #4A3D57;
          --pd2-ink-mute: #8A7D96;
          --pd2-warm-white: #FAF7F2;
          --pd2-line: #ECE5DC;
          --pd2-line-2: #D8D0C4;
          --pd2-green: #2A8A5F;
        }

        /* ── Breadcrumb ── */
        .pd2-breadcrumb {
          max-width: 1320px;
          margin: 0 auto;
          padding: 18px 40px 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--pd2-ink-mute);
          flex-wrap: wrap;
        }

        .pd2-bc-link {
          color: var(--pd2-ink-mute);
          text-decoration: none;
          transition: color 0.2s;
        }
        .pd2-bc-link:hover { color: var(--pd2-orange); }

        .pd2-bc-sep { color: var(--pd2-line-2); }

        .pd2-bc-current {
          color: var(--pd2-ink);
          font-weight: 600;
        }

        /* ── Stage grid ── */
        .pd2-stage {
          max-width: 1320px;
          margin: 0 auto;
          padding: 18px 40px 56px;
          display: grid;
          grid-template-columns: 1fr 1fr 360px;
          gap: 32px;
          align-items: start;
        }

        .pd2-gallery-col {
          position: sticky;
          top: 110px;
          min-width: 0;
          align-self: start;
        }

        /* ── Info column ── */
        .pd2-info { padding: 0 8px; }

        /* Brand row */
        .pd2-brand-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .pd2-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px 8px 8px;
          background: white;
          border: 1px solid var(--pd2-line);
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          color: var(--pd2-ink);
        }

        .pd2-brand-logo {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--pd2-ink);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 11px;
          flex-shrink: 0;
        }

        .pd2-brand-label {
          line-height: 1.1;
        }

        .pd2-brand-label small {
          display: block;
          font-size: 10px;
          color: var(--pd2-ink-mute);
          font-weight: 600;
        }

        .pd2-category {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          background: var(--pd2-purple-tint);
          color: var(--pd2-purple);
          border: 1px solid rgba(86,43,127,0.18);
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        /* Title */
        .pd2-title {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 26px;
          line-height: 1.25;
          letter-spacing: -0.015em;
          margin: 4px 0 18px;
          color: var(--pd2-ink);
        }

        /* Price block */
        .pd2-price-block {
          border-top: 1px solid var(--pd2-line);
          padding-top: 18px;
          margin-bottom: 20px;
        }

        .pd2-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }

        .pd2-price-main {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 40px;
          color: var(--pd2-ink);
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .pd2-price-sym { color: var(--pd2-orange); font-size: 22px; margin-right: 2px; }

        .pd2-price-usd {
          font-size: 14px;
          color: var(--pd2-ink-mute);
          font-weight: 600;
        }

        .pd2-price-meta {
          margin-top: 8px;
          font-size: 12.5px;
          color: var(--pd2-ink-mute);
        }

        .pd2-price-meta b { color: var(--pd2-ink); font-weight: 700; }

        /* Specs */
        .pd2-specs {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
          margin-bottom: 24px;
        }

        .pd2-spec {
          padding: 14px;
          border: 1px solid var(--pd2-line);
          border-radius: 14px;
          background: white;
        }

        .pd2-spec-lbl {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--pd2-ink-mute);
          margin-bottom: 6px;
        }

        .pd2-spec-val {
          font-size: 13px;
          font-weight: 700;
          color: var(--pd2-ink);
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          line-height: 1.3;
        }

        /* Description */
        .pd2-desc-section {
          border-top: 1px solid var(--pd2-line);
          padding-top: 24px;
          margin-top: 4px;
          margin-bottom: 28px;
        }

        .pd2-sect-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 14px;
          gap: 12px;
        }

        .pd2-sect-title {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 18px;
          color: var(--pd2-ink);
          margin: 0;
          letter-spacing: 0.02em;
        }

        .pd2-sect-meta {
          font-size: 11.5px;
          color: var(--pd2-ink-mute);
          font-weight: 600;
          white-space: nowrap;
        }

        .pd2-desc-body {
          font-size: 15px;
          line-height: 1.7;
          color: var(--pd2-ink-soft);
          position: relative;
          overflow: hidden;
          transition: max-height 0.4s ease;
        }

        .pd2-desc-collapsed { max-height: 200px; }
        .pd2-desc-expanded { max-height: 4000px; }

        .pd2-desc-body p { margin: 0 0 12px; }

        .pd2-desc-collapsed::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 80px;
          background: linear-gradient(180deg, transparent, var(--pd2-warm-white) 85%);
          pointer-events: none;
        }

        .pd2-desc-toggle {
          margin-top: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: white;
          color: var(--pd2-ink);
          border: 1.5px solid var(--pd2-line);
          font-size: 13px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .pd2-desc-toggle:hover {
          border-color: var(--pd2-orange);
          color: var(--pd2-orange);
        }

        .pd2-desc-toggle svg { transition: transform 0.3s; }
        .pd2-desc-open svg { transform: rotate(180deg); }

        /* Price breakdown */
        .pd2-breakdown {
          background: white;
          border: 1px solid var(--pd2-line);
          border-radius: 20px;
          overflow: hidden;
          margin-top: 4px;
        }

        .pd2-bd-head {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid var(--pd2-line);
          background: linear-gradient(180deg, var(--pd2-orange-tint) 0%, white 100%);
        }

        .pd2-bd-title {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 15px;
          color: var(--pd2-ink);
          margin: 0 0 4px;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pd2-bd-title svg { color: var(--pd2-orange); }

        .pd2-bd-tagline {
          font-size: 12px;
          color: var(--pd2-ink-mute);
        }

        .pd2-bd-head-right { text-align: right; }

        .pd2-bd-total-top {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 22px;
          color: var(--pd2-ink);
          letter-spacing: -0.01em;
          line-height: 1;
        }

        .pd2-bd-sym { color: var(--pd2-orange); }

        .pd2-bd-head-right small {
          font-size: 11px;
          color: var(--pd2-ink-mute);
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }

        .pd2-bd-group {
          padding: 8px 24px;
          border-top: 1px dashed var(--pd2-line);
        }

        .pd2-bd-group-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--pd2-ink-mute);
          margin: 12px 0 6px;
        }

        .pd2-bd-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 7px 0;
          font-size: 13px;
          color: var(--pd2-ink-soft);
        }

        .pd2-bd-label {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .pd2-bd-small {
          color: var(--pd2-ink-mute);
          font-weight: 600;
          font-size: 11px;
        }

        .pd2-bd-value {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-weight: 600;
          color: var(--pd2-ink);
          white-space: nowrap;
        }

        .pd2-bd-usd {
          color: var(--pd2-ink-mute);
          font-size: 11px;
          margin-left: 6px;
        }

        .pd2-info-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid var(--pd2-line-2);
          color: var(--pd2-ink-mute);
          font-size: 10px;
          font-weight: 800;
          cursor: help;
          flex-shrink: 0;
          transition: color 0.15s, border-color 0.15s;
        }

        .pd2-info-btn:hover { color: var(--pd2-orange); border-color: var(--pd2-orange); }

        .pd2-bd-total {
          padding: 18px 24px;
          background: var(--pd2-ink);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .pd2-bd-total-l {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .pd2-bd-total-l small {
          display: block;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          margin-top: 2px;
          letter-spacing: 0.02em;
          text-transform: none;
        }

        .pd2-bd-total-v {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 26px;
          color: #F4A261;
          letter-spacing: -0.01em;
          line-height: 1;
          text-align: right;
        }

        .pd2-bd-total-v small {
          display: block;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-weight: 600;
          font-size: 11px;
          color: rgba(255,255,255,0.55);
          margin-top: 3px;
        }

        .pd2-bd-foot {
          padding: 14px 24px;
          background: var(--pd2-warm-white);
          font-size: 11.5px;
          color: var(--pd2-ink-mute);
          display: flex;
          align-items: center;
          gap: 10px;
          line-height: 1.5;
        }

        .pd2-bd-foot svg { color: var(--pd2-purple); flex-shrink: 0; }
        .pd2-bd-foot b { color: var(--pd2-ink); font-weight: 700; }

        /* ── Purchase card ── */
        .pd2-buy-col {
          position: sticky;
          top: 110px;
          align-self: start;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pd2-buy {
          background: white;
          border: 1px solid var(--pd2-line);
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 20px 40px -20px rgba(20,7,31,0.12);
        }

        .pd2-buy-price {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .pd2-buy-cur {
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 34px;
          color: var(--pd2-ink);
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .pd2-buy-sym { color: var(--pd2-orange); }

        .pd2-buy-usd {
          font-size: 13px;
          color: var(--pd2-ink-mute);
          font-weight: 600;
        }

        .pd2-buy-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: var(--pd2-ink-soft);
          margin-bottom: 4px;
        }

        .pd2-buy-row svg { color: var(--pd2-orange); flex-shrink: 0; }
        .pd2-buy-row b { color: var(--pd2-ink); font-weight: 700; }

        .pd2-buy-delivery {
          margin: 14px 0 18px;
          padding: 12px 14px;
          background: var(--pd2-orange-tint);
          border: 1px solid rgba(220,111,52,0.18);
          border-radius: 12px;
          font-size: 12.5px;
          color: var(--pd2-ink-soft);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pd2-buy-delivery svg { color: var(--pd2-orange); flex-shrink: 0; }
        .pd2-buy-delivery b { color: var(--pd2-ink); font-weight: 700; }
        .pd2-delivery-sub { font-size: 11.5px; }

        .pd2-qty-block {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .pd2-qty-lbl {
          font-size: 12.5px;
          color: var(--pd2-ink-soft);
          font-weight: 600;
        }

        .pd2-qty {
          display: inline-flex;
          align-items: center;
          border: 1.5px solid var(--pd2-line);
          border-radius: 12px;
          overflow: hidden;
          background: white;
        }

        .pd2-qty button {
          width: 36px;
          height: 38px;
          border: 0;
          background: transparent;
          font-size: 16px;
          color: var(--pd2-ink-soft);
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, color 0.15s;
        }

        .pd2-qty button:hover { background: var(--pd2-warm-white); color: var(--pd2-ink); }

        .pd2-qty-val {
          min-width: 38px;
          text-align: center;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-size: 14px;
          font-weight: 700;
          color: var(--pd2-ink);
          border-left: 1px solid var(--pd2-line);
          border-right: 1px solid var(--pd2-line);
          height: 38px;
          line-height: 38px;
        }

        .pd2-stock {
          font-size: 11.5px;
          color: var(--pd2-green);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .pd2-stock-dot {
          width: 6px;
          height: 6px;
          background: var(--pd2-green);
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Buttons */
        .pd2-btn-buy {
          width: 100%;
          padding: 14px 18px;
          border: 0;
          border-radius: 14px;
          background: var(--pd2-orange);
          color: white;
          font-weight: 700;
          font-size: 14.5px;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 8px;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 20px -8px rgba(220,111,52,0.5);
        }

        .pd2-btn-buy:hover {
          background: #FF8A4A;
          transform: translateY(-1px);
          box-shadow: 0 12px 24px -8px rgba(220,111,52,0.55);
          color: white;
        }

        .pd2-btn-buy-added {
          background: var(--pd2-green);
          box-shadow: 0 8px 20px -8px rgba(42,138,95,0.4);
        }

        .pd2-btn-buy-added:hover {
          background: #22744e;
          box-shadow: 0 12px 24px -8px rgba(42,138,95,0.45);
        }

        .pd2-btn-wish {
          width: 100%;
          padding: 12px 18px;
          border: 1.5px solid var(--pd2-line);
          border-radius: 14px;
          background: white;
          color: var(--pd2-ink);
          font-weight: 700;
          font-size: 13.5px;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .pd2-btn-wish:hover { border-color: var(--pd2-orange); color: var(--pd2-orange); }
        .pd2-btn-wish-active { border-color: #dc3545; color: #dc3545; }
        .pd2-btn-wish-active:hover { border-color: #b02a37; color: #b02a37; }

        /* Trust */
        .pd2-buy-trust {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid var(--pd2-line);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pd2-trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: var(--pd2-ink-soft);
        }

        .pd2-trust-item svg { color: var(--pd2-purple); flex-shrink: 0; }
        .pd2-trust-item b { color: var(--pd2-ink); font-weight: 700; }

        /* Spec request */
        .pd2-spec-request {
          background: linear-gradient(180deg, white 0%, var(--pd2-purple-tint) 100%);
          border: 1px solid rgba(86,43,127,0.18);
          border-radius: 20px;
          padding: 22px;
        }

        .pd2-spec-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-archivo-black), 'Archivo Black', sans-serif;
          font-size: 13px;
          color: var(--pd2-ink);
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }

        .pd2-spec-title svg { color: var(--pd2-purple); flex-shrink: 0; }

        .pd2-spec-desc {
          font-size: 12px;
          color: var(--pd2-ink-soft);
          margin: 0 0 12px;
          line-height: 1.5;
        }

        .pd2-spec-textarea {
          width: 100%;
          resize: vertical;
          min-height: 70px;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--pd2-line);
          background: white;
          font-family: inherit;
          font-size: 13px;
          color: var(--pd2-ink);
          outline: 0;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .pd2-spec-textarea:focus {
          border-color: var(--pd2-purple);
          box-shadow: 0 0 0 3px rgba(86,43,127,0.1);
        }

        .pd2-spec-textarea::placeholder { color: var(--pd2-ink-mute); }

        /* ── Trust strip ── */
        .pd2-trust-strip {
          background: white;
          border-top: 1px solid var(--pd2-line);
          border-bottom: 1px solid var(--pd2-line);
          padding: 32px 40px;
        }

        .pd2-trust-inner {
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .pd2-trust-card {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .pd2-t-ico {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .pd2-t-ico-orange { background: var(--pd2-orange-tint); color: var(--pd2-orange); }
        .pd2-t-ico-purple { background: var(--pd2-purple-tint); color: var(--pd2-purple); }

        .pd2-t-title { margin: 0 0 4px; font-size: 14px; font-weight: 800; color: var(--pd2-ink); }
        .pd2-t-desc { margin: 0; font-size: 12.5px; color: var(--pd2-ink-mute); line-height: 1.45; }

        /* ── Responsive ── */
        /* Tablet ancho: galería sticky a la izquierda, info + compra a la
           derecha. La card de compra sigue sticky dentro de su columna. */
        @media (max-width: 1100px) {
          .pd2-stage {
            grid-template-columns: minmax(0, 1fr) 320px;
          }
          .pd2-gallery-col {
            grid-row: 1 / span 2;
          }
          .pd2-info {
            grid-column: 2;
            grid-row: 1;
          }
          .pd2-buy-col {
            grid-column: 2;
            grid-row: 2;
          }
          .pd2-trust-inner { grid-template-columns: repeat(2, 1fr); }
        }

        /* Tablet angosto / móvil: una sola columna, todo en flujo normal. */
        @media (max-width: 860px) {
          .pd2-stage {
            grid-template-columns: 1fr;
            padding: 16px 20px 40px;
          }
          .pd2-gallery-col {
            position: static;
            grid-row: auto;
          }
          .pd2-info { grid-column: auto; grid-row: auto; }
          .pd2-buy-col {
            position: static;
            grid-column: auto;
            grid-row: auto;
          }
          .pd2-breadcrumb { padding: 14px 20px 4px; }
          .pd2-trust-strip { padding: 24px 20px; }
          .pd2-trust-inner { grid-template-columns: 1fr 1fr; gap: 16px; }
          .pd2-price-main { font-size: 32px; }
          .pd2-buy-cur { font-size: 28px; }
        }

        @media (max-width: 480px) {
          .pd2-trust-inner { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
