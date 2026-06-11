"use client";

import HeaderLight from "@/presentation/components/headers/HeaderLight";
import FooterLight from "@/presentation/components/footers/FooterLight";
import Wishlist from "@/presentation/components/shop-cart/Wishlist";

export default function WishlistPage() {
  return (
    <div style={{ background: "#F7F4EF", minHeight: "100vh" }}>
      <HeaderLight />
      <Wishlist />
      <FooterLight />
    </div>
  );
}
