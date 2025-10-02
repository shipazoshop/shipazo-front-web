"use client";

import { useContextElement } from "@/application/context/Context";

export default function CartTotal() {
  const { totalPrice } = useContextElement();
  return <>${totalPrice.toFixed(3)}</>;
}

