"use client";

import { useContextElement } from "@/application/context/Context";

export default function CompareLength() {
  const { compareItem } = useContextElement();
  return <>{compareItem.length}</>;
}

