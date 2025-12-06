"use client";

import { useWishlistActions } from "@/application/stores/useWishlistStore";

export default function AddToWishlist({ productId, tooltipClass = "" }) {
  const { toggleWishlist, isAddedToWishlist } = useWishlistActions();
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        toggleWishlist(productId);
      }}
      className={`box-icon btn-icon-action hover-tooltip ${tooltipClass}`}
    >
      <span
        className={`icon ${
          isAddedToWishlist(productId) ? "icon-trash" : "icon-heart2"
        } `}
      />
      {/* <span className="tooltip">
        {" "}
        {isAddedToWishlist(productId) ? "Remove Wishlist" : "Add to Wishlist"}
      </span> */}
    </a>
  );
}

