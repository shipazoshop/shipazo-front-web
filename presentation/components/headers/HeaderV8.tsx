"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartLength from "../common/CartLength";
import UserMenu from "./UserMenu";
import WishlistDropdown from "./WishlistDropdown";

export default function HeaderV8() {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleWishlistEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setWishlistOpen(true);
  };

  const handleWishlistLeave = () => {
    closeTimerRef.current = setTimeout(() => setWishlistOpen(false), 120);
  };

  return (
    <>
      <nav className="hv8-nav">
        {/* Logo */}
        <Link href="/" className="hv8-logo-mark">
          <Image
            alt="Shipazo"
            src="/images/logo/favicon-shipazo.webp"
            width={36}
            height={36}
            priority
            style={{ borderRadius: 8 }}
          />
          <span className="hv8-logo-word">SHIPAZO</span>
        </Link>

        {/* Actions */}
        <div className="hv8-nav-acts">
          {/* Wishlist */}
          <div
            className="hv8-nav-ico-wrapper"
            onMouseEnter={handleWishlistEnter}
            onMouseLeave={handleWishlistLeave}
          >
            <Link href="/wishlist" className="hv8-nav-ico" title="Favoritos" aria-label="Favoritos">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
              </svg>
            </Link>
            <section
              aria-label="Wishlist preview"
              onMouseEnter={handleWishlistEnter}
              onMouseLeave={handleWishlistLeave}
              style={{
                position: "fixed",
                top: "72px",
                left: 0,
                right: 0,
                zIndex: 999,
                boxShadow: "0px 4px 24px 0px rgba(86,43,127,0.25)",
                borderRadius: "0 0 12px 12px",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                backgroundColor: "rgba(20,7,31,0.7)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                opacity: wishlistOpen ? 1 : 0,
                marginTop: wishlistOpen ? "0px" : "-8px",
                pointerEvents: wishlistOpen ? "all" : "none",
                transition: "opacity 0.22s ease, margin-top 0.22s ease",
              }}
            >
              <WishlistDropdown />
            </section>
          </div>

          {/* Orders */}
          <Link href="/orders" className="hv8-nav-ico" title="Mis pedidos" aria-label="Mis pedidos">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </Link>

          {/* Cart */}
          <a
            href="#shoppingCart"
            data-bs-toggle="offcanvas"
            className="hv8-nav-ico"
            aria-label="Carrito de compras"
            style={{ position: "relative", textDecoration: "none" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            <span className="hv8-badge">
              <CartLength />
            </span>
          </a>

          {/* Mi cuenta CTA */}
          <UserMenu variant="v8" />
        </div>
      </nav>

      <style>{`
        .hv8-nav {
          height: 72px;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(20,7,31,0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .hv8-logo-mark {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .hv8-logo-word {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          color: white;
          font-size: 20px;
          letter-spacing: -0.01em;
        }

        .hv8-nav-acts {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hv8-nav-ico-wrapper {
          position: relative;
        }

        .hv8-nav-ico {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          text-decoration: none;
          position: relative;
        }

        .hv8-nav-ico:hover {
          background: rgba(255,255,255,0.12);
          transform: translateY(-1px);
          color: white;
        }

        .hv8-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          background: #dc6f34;
          color: white;
          font-size: 10px;
          font-weight: 800;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #14071f;
          line-height: 1;
        }

        @media (max-width: 768px) {
          .hv8-nav {
            display: none;
          }

          .hv8-logo-word {
            font-size: 17px;
          }

          .hv8-nav-acts {
            gap: 6px;
          }

          .hv8-nav-ico {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </>
  );
}
