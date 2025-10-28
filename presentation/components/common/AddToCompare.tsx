"use client";

import { useCompareActions } from "@/application/stores/useCompareStore";

export default function AddToCompare({ productId, tooltipClass = "" }) {
  const { addToCompare, isAddedToCompare } = useCompareActions();
  return (
    <a
      href="#compare"
      data-bs-toggle="offcanvas"
      onClick={() => addToCompare(productId)}
      className={`box-icon btn-icon-action hover-tooltip ${tooltipClass}`}
    >
      <span className="icon icon-compare1" />
      <span className="tooltip">
        {" "}
        {isAddedToCompare(productId) ? "Compared" : "Compare"}
      </span>
    </a>
  );
}

