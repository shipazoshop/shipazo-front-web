"use client";

import { useContextElement } from "@/application/context/Context";

export default function WishlistLength() {
  const { wishList } = useContextElement();
  return <>{wishList.length}</>;
}

