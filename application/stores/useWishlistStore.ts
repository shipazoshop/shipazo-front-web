import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  // State
  wishlist: number[];

  // Actions
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (id: number) => void;
  isAddedToWishlist: (id: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      // Initial state
      wishlist: [],

      // Actions
      addToWishlist: (id: number) => {
        set((state) => {
          if (state.wishlist.includes(id)) {
            return state;
          }
          return { wishlist: [...state.wishlist, id] };
        });
      },

      removeFromWishlist: (id: number) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item !== id),
        }));
      },

      toggleWishlist: (id: number) => {
        set((state) => {
          if (state.wishlist.includes(id)) {
            return { wishlist: state.wishlist.filter((item) => item !== id) };
          }
          return { wishlist: [...state.wishlist, id] };
        });
        // TODO: Open wishlist modal
        // openWishlistModal();
      },

      isAddedToWishlist: (id: number) => {
        const { wishlist } = get();
        return wishlist.includes(id);
      },

      clearWishlist: () => {
        set({ wishlist: [] });
      },
    }),
    {
      name: "wishlist-storage", // name of the item in localStorage
    }
  )
);

// Selectors for optimized rendering
export const useWishlist = () => useWishlistStore((state) => state.wishlist);
export const useWishlistLength = () => useWishlistStore((state) => state.wishlist.length);

// Individual action selectors (recommended approach)
export const useAddToWishlist = () => useWishlistStore((state) => state.addToWishlist);
export const useRemoveFromWishlist = () => useWishlistStore((state) => state.removeFromWishlist);
export const useToggleWishlist = () => useWishlistStore((state) => state.toggleWishlist);
export const useIsAddedToWishlist = () => useWishlistStore((state) => state.isAddedToWishlist);
export const useClearWishlist = () => useWishlistStore((state) => state.clearWishlist);

// Legacy: Combined actions selector
export const useWishlistActions = () => {
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isAddedToWishlist = useWishlistStore((state) => state.isAddedToWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  return {
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isAddedToWishlist,
    clearWishlist,
  };
};
