"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/application/state/product";
import { useProductRepository } from "@/presentation";
import { LoadingScreen } from "../common/LoadingScreen";
import CartLength from "../common/CartLength";
import UserMenu from "./UserMenu";
import WishlistDropdown from "./WishlistDropdown";

export default function HeaderLight() {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { setProduct } = useProductStore();
  const router = useRouter();
  const { importProductFromUrl } = useProductRepository();
  const { mutateAsync, isLoading } = importProductFromUrl();

  const handleWishlistEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setWishlistOpen(true);
  };
  const handleWishlistLeave = () => {
    closeTimerRef.current = setTimeout(() => setWishlistOpen(false), 120);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchTerm.trim()) { inputRef.current?.focus(); return; }
    try {
      const result = await mutateAsync({ url: searchTerm });
      router.push(`/product-detail/${result.productData.product_id}?url=${encodeURIComponent(searchTerm)}`);
      setProduct(result);
      setSearchTerm("");
    } catch { }
  };

  return (
    <>
      <nav className="shz-nav">
        {/* Logo */}
        <Link href="/home" className="shz-nav__logo">
          <Image
            alt="Shipazo"
            src="/images/logo/favicon-shipazo.webp"
            width={32}
            height={32}
            style={{ borderRadius: 8 }}
            priority
          />
          <span className="shz-nav__wordmark">SHIPAZO</span>
        </Link>

        {/* Search */}
        <form className="shz-nav__search" role="search" onSubmit={handleSubmit}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A7D96" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
          </svg>
          <input
            ref={inputRef}
            name="q"
            type="text"
            placeholder="Cotiza tu producto ahora — pega un link de Amazon, Shein, AliExpress…"
            aria-label="Buscar producto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" title="Buscar" aria-label="Buscar" disabled={isLoading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
            </svg>
          </button>
        </form>

        {/* Actions */}
        <div className="shz-nav__acts">
          {/* Wishlist */}
          <div
            className="shz-nav__ico-wrap"
            onMouseEnter={handleWishlistEnter}
            onMouseLeave={handleWishlistLeave}
          >
            <button className="shz-nav__ico" title="Favoritos" aria-label="Favoritos">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
              </svg>
            </button>
            {wishlistOpen && (
              <div
                className="shz-nav__dropdown"
                onMouseEnter={handleWishlistEnter}
                onMouseLeave={handleWishlistLeave}
              >
                <WishlistDropdown />
              </div>
            )}
          </div>

          {/* Orders */}
          <Link href="/orders" className="shz-nav__ico" aria-label="Mis órdenes" title="Mis órdenes">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
            </svg>
          </Link>

          {/* Cart */}
          <a href="#shoppingCart" data-bs-toggle="offcanvas" className="shz-nav__ico" aria-label="Carrito" title="Carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            <CartLength />
          </a>

          {/* User */}
          <UserMenu />
        </div>
      </nav>

      <LoadingScreen show={isLoading} />

      <style>{`
        .shz-nav {
          background: #fff;
          border-bottom: 1px solid #ECE5DC;
          padding: 16px 40px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 32px;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        /* Logo */
        .shz-nav__logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .shz-nav__wordmark {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: 18px;
          color: #1A0D24;
          letter-spacing: -0.01em;
        }

        /* Search */
        .shz-nav__search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1.5px solid #ECE5DC;
          border-radius: 999px;
          padding: 6px 6px 6px 22px;
          transition: border-color 0.2s, box-shadow 0.2s;
          min-width: 0;
        }
        .shz-nav__search:focus-within {
          border-color: #DC6F34;
          box-shadow: 0 0 0 4px rgba(220,111,52,0.12);
        }
        .shz-nav__search input,
        .shz-nav__search input:not([type]),
        .shz-nav__search input[type="text"] {
          flex: 1;
          border: 0 !important;
          outline: 0 !important;
          appearance: none;
          -webkit-appearance: none;
          box-shadow: none !important;
          font-size: 14px;
          padding: 10px 4px;
          font-family: inherit;
          background: transparent;
          color: #1A0D24;
          min-width: 0;
          border-radius: 0;
        }
        .shz-nav__search input::placeholder { color: #8A7D96; }
        .shz-nav__search input:disabled { opacity: 0.6; }
        .shz-nav__search button {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #DC6F34;
          border: 0;
          color: #fff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .shz-nav__search button:hover:not(:disabled) { background: #FF8A4A; transform: scale(1.05); }
        .shz-nav__search button:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Actions */
        .shz-nav__acts {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .shz-nav__ico-wrap { position: relative; }
        .shz-nav__ico {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #1A0D24;
          position: relative;
          cursor: pointer;
          background: transparent;
          border: 0;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .shz-nav__ico:hover { background: #FAF7F2; color: #DC6F34; }
        .shz-nav__ico.is-active { background: #FDF4ED; color: #DC6F34; }

        .shz-nav__dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          z-index: 200;
          min-width: 320px;
        }

        /* Responsive: ≤720px → search drops to second row */
        @media (max-width: 720px) {
          .shz-nav {
            grid-template-columns: auto 1fr;
            grid-template-areas: "logo acts" "search search";
            gap: 10px 16px;
            padding: 12px 18px;
          }
          .shz-nav__logo   { grid-area: logo; }
          .shz-nav__acts   { grid-area: acts; justify-self: end; }
          .shz-nav__search { grid-area: search; }
          .shz-nav__wordmark { display: none; }
        }
      `}</style>
    </>
  );
}
