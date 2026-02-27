"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartLength from "../common/CartLength";
import UserMenu from "./UserMenu";
import WishlistDropdown from "./WishlistDropdown";
import { Heart, Package } from "lucide-react";

export default function Header1() {
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
    <header className="tf-header style-2">

      <div className="header-bottom bg-gray-5 d-none d-xl-block">
        <div className="container relative">
          <div className="row align-items-center" style={{ minHeight: "60px" }}>
            <div className="col-xl-9 col-12">
              <div className="header-bt-left">
                <Link href="/">
                  <Image
                    alt="Logo"
                    src="/images/logo/favicon-shipazo.webp"
                    width={41}
                    height={41}
                    style={{ aspectRatio: "513 / 512" }}
                  />
                </Link>
              </div>
            </div>
            <div className="col-xl-3 d-none d-xl-flex align-items-center justify-content-end">
              <div className="header-bt-right">
                <ul className="nav-icon style-2">
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
                      <Heart size={26} className="text-main link" strokeWidth={1.5} />
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
                      }}>
                      <WishlistDropdown />
                    </section>
                  </li>
                  <li className="nav-shop-cart">
                    <Link
                      href="/orders"
                      className="d-flex align-items-center"
                      style={{ textDecoration: "none" }}
                    >
                      <Package size={26} className="text-main link" strokeWidth={1.5} />
                    </Link>
                  </li>
                  <li className="nav-shop-cart">
                    <a
                      href="#shoppingCart"
                      data-bs-toggle="offcanvas"
                      className="d-flex"
                    >
                      <i className="icon-cart text-main fs-26 link" />
                      <span className="count-box">
                        <CartLength />
                      </span>
                    </a>
                  </li>
                  <UserMenu />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
