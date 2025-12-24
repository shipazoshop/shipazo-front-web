"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareStore {
  // State
  compareItems: number[];

  // Actions
  addToCompare: (id: number) => void;
  removeFromCompare: (id: number) => void;
  toggleCompare: (id: number) => void;
  isAddedToCompare: (id: number) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      // Initial state
      compareItems: [],

      // Actions
      addToCompare: (id: number) => {
        set((state) => {
          if (state.compareItems.includes(id)) {
            return state;
          }
          return { compareItems: [...state.compareItems, id] };
        });
      },

      removeFromCompare: (id: number) => {
        set((state) => ({
          compareItems: state.compareItems.filter((item) => item !== id),
        }));
      },

      toggleCompare: (id: number) => {
        set((state) => {
          if (state.compareItems.includes(id)) {
            return { compareItems: state.compareItems.filter((item) => item !== id) };
          }
          return { compareItems: [...state.compareItems, id] };
        });
      },

      isAddedToCompare: (id: number) => {
        const { compareItems } = get();
        return compareItems.includes(id);
      },

      clearCompare: () => {
        set({ compareItems: [] });
      },
    }),
    {
      name: "compare-storage", // name of the item in localStorage
    }
  )
);

// Selectors for optimized rendering
export const useCompareItems = () => useCompareStore((state) => state.compareItems);
export const useCompareLength = () => useCompareStore((state) => state.compareItems.length);

// Individual action selectors (recommended approach)
export const useAddToCompare = () => useCompareStore((state) => state.addToCompare);
export const useRemoveFromCompare = () => useCompareStore((state) => state.removeFromCompare);
export const useToggleCompare = () => useCompareStore((state) => state.toggleCompare);
export const useIsAddedToCompare = () => useCompareStore((state) => state.isAddedToCompare);
export const useClearCompare = () => useCompareStore((state) => state.clearCompare);

// Legacy: Combined actions selector
export const useCompareActions = () => {
  const addToCompare = useCompareStore((state) => state.addToCompare);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const toggleCompare = useCompareStore((state) => state.toggleCompare);
  const isAddedToCompare = useCompareStore((state) => state.isAddedToCompare);
  const clearCompare = useCompareStore((state) => state.clearCompare);

  return {
    addToCompare,
    removeFromCompare,
    toggleCompare,
    isAddedToCompare,
    clearCompare,
  };
};
