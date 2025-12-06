import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistProduct } from "@/domain/mappers/product.mapper";
import {
  mapImportProductToWishlistProduct,
  mapLegacyProductToImportProduct,
} from "@/domain/mappers/product.mapper";
import type { IImportProductResponse } from "@/domain/dto/import-product.dto";
import { allProducts } from "@/shared/constants/products";

type Product = (typeof allProducts)[number];

interface WishlistStore {
  // State
  wishlistProducts: WishlistProduct[];

  // Actions
  addToWishlist: (product: IImportProductResponse) => void;
  addToWishlistById: (id: number) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (product: IImportProductResponse) => void;
  isAddedToWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const findProductById = (id: number): Product | undefined =>
  allProducts.find((product) => product.id === id);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      // Initial state
      wishlistProducts: [],

      // Actions
      addToWishlist: (product: IImportProductResponse) => {
        const { wishlistProducts } = get();
        const productId = product.productData.product_id;

        // Check if already in wishlist
        if (wishlistProducts.some((p) => p.productData.product_id === productId)) {
          return;
        }

        const productToAdd = mapImportProductToWishlistProduct(product);

        set((state) => ({
          wishlistProducts: [...state.wishlistProducts, productToAdd],
        }));
      },

      addToWishlistById: (id: number) => {
        const { wishlistProducts, addToWishlist } = get();
        const stringId = String(id);

        // Check if already in wishlist
        if (wishlistProducts.some((p) => p.productData.product_id === stringId)) {
          return;
        }

        const legacyProduct = findProductById(id);
        if (!legacyProduct) {
          return;
        }

        // Convert legacy product to IImportProductResponse
        const importProduct = mapLegacyProductToImportProduct(legacyProduct);
        addToWishlist(importProduct);
      },

      removeFromWishlist: (id: string) => {
        set((state) => ({
          wishlistProducts: state.wishlistProducts.filter(
            (item) => item.productData.product_id !== id
          ),
        }));
      },

      toggleWishlist: (product: IImportProductResponse) => {
        const { wishlistProducts } = get();
        const productId = product.productData.product_id;

        if (wishlistProducts.some((p) => p.productData.product_id === productId)) {
          set({
            wishlistProducts: wishlistProducts.filter(
              (item) => item.productData.product_id !== productId
            ),
          });
        } else {
          const productToAdd = mapImportProductToWishlistProduct(product);
          set({ wishlistProducts: [...wishlistProducts, productToAdd] });
        }
        // TODO: Open wishlist modal
        // openWishlistModal();
      },

      isAddedToWishlist: (id: string) => {
        const { wishlistProducts } = get();
        return wishlistProducts.some(
          (product) => product.productData.product_id === id
        );
      },

      clearWishlist: () => {
        set({ wishlistProducts: [] });
      },
    }),
    {
      name: "wishlist-storage", // name of the item in localStorage
      partialize: (state) => ({
        wishlistProducts: state.wishlistProducts,
      }),
    }
  )
);

// Selectors for optimized rendering
export const useWishlist = () => useWishlistStore((state) => state.wishlistProducts);
export const useWishlistLength = () => useWishlistStore((state) => state.wishlistProducts.length);

// Individual action selectors (recommended approach)
export const useAddToWishlist = () => useWishlistStore((state) => state.addToWishlist);
export const useAddToWishlistById = () => useWishlistStore((state) => state.addToWishlistById);
export const useRemoveFromWishlist = () => useWishlistStore((state) => state.removeFromWishlist);
export const useToggleWishlist = () => useWishlistStore((state) => state.toggleWishlist);
export const useIsAddedToWishlist = () => useWishlistStore((state) => state.isAddedToWishlist);
export const useClearWishlist = () => useWishlistStore((state) => state.clearWishlist);

// Legacy: Combined actions selector
export const useWishlistActions = () => {
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const addToWishlistById = useWishlistStore((state) => state.addToWishlistById);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isAddedToWishlist = useWishlistStore((state) => state.isAddedToWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  return {
    addToWishlist,
    addToWishlistById,
    removeFromWishlist,
    toggleWishlist,
    isAddedToWishlist,
    clearWishlist,
  };
};
