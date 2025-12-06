"use client";

import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Link from "next/link";
import CartLength from "../common/CartLength";
import WishlistLength from "../common/WishlistLength";
import CompareLength from "../common/CompareLength";
import { useIsAuthenticated } from "@/application/stores/useAuthStore";
import { useAuthRepository } from "@/presentation/hooks/repositories/useAuthRepository";

export default function Header1() {
  const isAuthenticated = useIsAuthenticated();
  const { logout } = useAuthRepository();
  const [mounted, setMounted] = useState(false);

  // Esperar a que el componente esté montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug temporal
  console.log("🔍 Header1 - isAuthenticated:", isAuthenticated, "mounted:", mounted);

  return (
    <header className="tf-header style-2">

      <div className="header-bottom bg-gray-5 d-none d-xl-block">
        <div className="container relative">
          <div className="row">
            <div className="col-xl-9 col-12">
              <div className="header-bt-left">
                <nav className="main-nav-menu">
                  <ul className="nav-list">
                    <Nav />
                  </ul>
                </nav>
              </div>
            </div>
            <div className="col-xl-3 d-none d-xl-flex align-items-center justify-content-end">
              <div className="header-bt-right">
                <ul className="nav-icon style-2">
                  <li>
                    <Link href={`/analytics`} className="d-flex align-items-center" title="Sales Analytics">
                      <svg
                        width={26}
                        height={26}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 3V21H21"
                          stroke="#333E48"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 16L12 11L15 14L21 8"
                          stroke="#333E48"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 8V12"
                          stroke="#333E48"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 8H21"
                          stroke="#333E48"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </li>

                  {/* <li>
                    <Link href={`/wishlist`} className="d-flex">
                      <i className="icon-hearth text-main fs-26 link" />
                      <span className="count-box">
                        <WishlistLength />
                      </span>
                    </Link>
                  </li> */}
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
                  <li>
                    {!mounted ? (
                      // Skeleton loader mientras se hidrata
                      <div className="d-flex align-items-center" style={{ width: 26, height: 26 }}>
                        <div style={{
                          width: 26,
                          height: 26,
                          backgroundColor: '#e5e7eb',
                          borderRadius: '4px',
                          animation: 'pulse 1.5s ease-in-out infinite'
                        }} />
                      </div>
                    ) : isAuthenticated ? (
                      <button
                        onClick={logout}
                        className="d-flex align-items-center border-0 bg-transparent cursor-pointer"
                        title="Cerrar sesión"
                        style={{ padding: 0 }}
                      >
                        <svg
                          width={26}
                          height={26}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                            stroke="#333E48"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16 17L21 12L16 7"
                            stroke="#333E48"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 12H9"
                            stroke="#333E48"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ) : (
                      <Link href={`/login`} className="d-flex align-items-center" title="Iniciar sesión">
                        <svg
                          width={26}
                          height={26}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                            stroke="#333E48"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                            stroke="#333E48"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
