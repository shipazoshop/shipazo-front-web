"use client";

import Header1 from "@/presentation/components/headers/Header1";
import EmptySearchBanner from "@/presentation/components/homes/home-5/EmptySearchBanner";
import { AdminFloatingButton } from "@/presentation/components/common/AdminFloatingButton";
import React from "react";
import Footer1 from "@/presentation/components/footers/Footer1";

export default function HomePage() {
  return (
    <>
      {/* <Topbar1 parentClass="tf-topbar" /> */}
      <Header1 />
      <div className="tf-sp-7">
        <div className="container">
          <div className="container-wrap">
            <div className="container-main">
              <EmptySearchBanner />
            </div>
          </div>
        </div>
      </div>
      <Footer1 />

      {/* Botón flotante para admins */}
      <AdminFloatingButton />
    </>
  );
}