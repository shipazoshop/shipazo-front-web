"use client";

import { useContextElement } from "@/application/context/Context";

export default function CartLength() {
  const { cartProducts } = useContextElement();
  return <>{cartProducts.length}</>;
}

