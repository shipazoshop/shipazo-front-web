"use client";

import React from "react";
import Nav from "./Nav";
import Link from "next/link";
import CartLength from "../common/CartLength";
import UserMenu from "./UserMenu";
import { Package } from "lucide-react";

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
