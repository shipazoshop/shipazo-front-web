"use client";

import { useCartActions } from "@/application/stores/useCartStore";

export default function AddToCart({ productId, tooltipClass = "" }) {
  const { addProductToCartById, isAddedToCartProducts } = useCartActions();
  return (
    <>
      <a
        href="#shoppingCart"
        data-bs-toggle="offcanvas"
        onClick={() => addProductToCartById(productId)}
        className={`box-icon add-to-cart btn-icon-action hover-tooltip ${tooltipClass}`}
      >
        <span className="icon icon-cart2" />
        <span className="tooltip">
          {isAddedToCartProducts(String(productId)) ? "Already Added" : "Add to Cart"}
        </span>
      </a>
    </>
  );
}

