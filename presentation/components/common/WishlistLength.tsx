"use client";

import { useWishlistLength } from "@/application/stores/useWishlistStore";

export default function WishlistLength() {
  const wishlistLength = useWishlistLength();
  return <>{wishlistLength}</>;
}

