"use client";

import { useCompareLength } from "@/application/stores/useCompareStore";

export default function CompareLength() {
  const compareLength = useCompareLength();
  return <>{compareLength}</>;
}

