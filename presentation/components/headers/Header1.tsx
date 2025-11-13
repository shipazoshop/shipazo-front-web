import React from "react";
import Nav from "./Nav";
import Image from "next/image";
import Link from "next/link";
import SearchForm from "./SearchForm";
import CartLength from "../common/CartLength";
import WishlistLength from "../common/WishlistLength";
import CompareLength from "../common/CompareLength";
export default function Header1() {
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
