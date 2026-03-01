"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchForm from "./SearchForm";
import CartLength from "../common/CartLength";
import UserMenu from "./UserMenu";
import WishlistDropdown from "./WishlistDropdown";
import { Heart, Package } from "lucide-react";

export default function Header4({ fullWidth = false, variant = "default" }: { fullWidth?: boolean; variant?: "default" | "orange" }) {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleWishlistEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setWishlistOpen(true);
  };

  const handleWishlistLeave = () => {
    closeTimerRef.current = setTimeout(() => setWishlistOpen(false), 120);
  };

  const isOrange = variant === "orange";
  const iconColor = isOrange ? "#ffffff" : "currentColor";
  const headerBg = isOrange ? "var(--color-brand-orange)" : undefined;
  const logoSrc = isOrange ? "/images/logo/shipazo-white.png" : "/images/logo/horizontal-shipazo.webp";
  // horizontal-shipazo.webp: 1018x259 → height 41px → width 185
  // shipazo-white.png: 4501x2230 → ratio 2.02 → height 41px → width 83
  const logoWidth = isOrange ? 83 : 185;
  const logoHeight = 41;

  return (
    <header className="tf-header" style={headerBg ? { backgroundColor: headerBg } : undefined}>
      <div className="inner-header line-bt">
        <div className={`container${fullWidth ? "-full" : ""}`}>
          <div className="row">
            <div className=" col-lg-2 col-6 d-flex align-items-center">
              <div className="logo-site">
                <Link href={`/`}>
                  <Image
                    alt="Logo"
                    src={logoSrc}
                    width={logoWidth}
                    height={logoHeight}
                    style={{ objectFit: "contain" }}
                  />
                </Link>
              </div>
            </div>
            <div className=" col-lg-8 d-none d-lg-block">
              <div className="header-center">
                <SearchForm parentClass={`form-search-product m-auto${isOrange ? " search-bg-orange" : ""}`} variant={variant} />
              </div>
            </div>
            <div className=" col-lg-2 col-6 d-flex align-items-center justify-content-end">
              <div className="header-right">
                <ul className="nav-icon justify-content-xl-center">
                  <li
                    className="nav-shop-cart"
                    style={{ position: "relative" }}
                    onMouseEnter={handleWishlistEnter}
                    onMouseLeave={handleWishlistLeave}
                  >
                    <Link
                      href="/wishlist"
                      className="d-flex align-items-center"
                      style={{ textDecoration: "none" }}
                    >
                      <Heart size={26} strokeWidth={1.5} color={iconColor} className="link" />
                    </Link>
                    <section
                      aria-label="Wishlist preview"
                      onMouseEnter={handleWishlistEnter}
                      onMouseLeave={handleWishlistLeave}
                      style={{
                        position: "fixed",
                        top: "60px",
                        left: 0,
                        right: 0,
                        zIndex: 999,
                        boxShadow: "0px 4px 9px 0px rgba(0, 64, 193, 0.2)",
                        borderRadius: "0 0 5px 5px",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        backgroundColor: "rgba(255,255,255,0.6)",
                        opacity: wishlistOpen ? 1 : 0,
                        marginTop: wishlistOpen ? "0px" : "-8px",
                        pointerEvents: wishlistOpen ? "all" : "none",
                        transition: "opacity 0.22s ease, margin-top 0.22s ease",
                      }}
                    >
                      <WishlistDropdown />
                    </section>
                  </li>
                  <li className="nav-shop-cart">
                    <Link
                      href="/orders"
                      className="d-flex align-items-center"
                      style={{ textDecoration: "none" }}
                    >
                      <Package size={26} strokeWidth={1.5} color={iconColor} className="link" />
                    </Link>
                  </li>
                  <li className="nav-cart" style={{ position: "relative" }}>
                    <a
                      href="#shoppingCart"
                      data-bs-toggle="offcanvas"
                      className="d-flex"
                    >
                      <i className="icon-cart link fs-26" style={{ color: iconColor }} />
                      <span className="count-box" style={{ top: "-8px", right: "-12px" }}>
                        <CartLength />
                      </span>
                    </a>
                  </li>
                  <UserMenu iconColor={iconColor} />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
