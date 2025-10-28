"use client";

import { useCartLength } from "@/application/stores/useCartStore";

export default function CartLength() {
  const cartLength = useCartLength();
  return <>{cartLength}</>;
}

