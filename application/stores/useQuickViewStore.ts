"use client";

import { create } from "zustand";
import { allProducts } from "@/shared/constants/products";

type Product = (typeof allProducts)[number];

interface QuickViewStore {
  // State
  quickViewItem: Product | null;
  quickAddItem: number;

  // Actions
  setQuickViewItem: (item: Product) => void;
  setQuickAddItem: (id: number) => void;
  clearQuickView: () => void;
}

export const useQuickViewStore = create<QuickViewStore>((set) => ({
  // Initial state
  quickViewItem: allProducts[0] || null,
  quickAddItem: 1,

  // Actions
  setQuickViewItem: (item: Product) => {
    set({ quickViewItem: item });
  },

  setQuickAddItem: (id: number) => {
    set({ quickAddItem: id });
  },

  clearQuickView: () => {
    set({ quickViewItem: allProducts[0] || null, quickAddItem: 1 });
  },
}));

// Selectors for optimized rendering
export const useQuickViewItem = () => useQuickViewStore((state) => state.quickViewItem);
export const useQuickAddItem = () => useQuickViewStore((state) => state.quickAddItem);

// Individual action selectors (recommended approach)
export const useSetQuickViewItem = () => useQuickViewStore((state) => state.setQuickViewItem);
export const useSetQuickAddItem = () => useQuickViewStore((state) => state.setQuickAddItem);
export const useClearQuickView = () => useQuickViewStore((state) => state.clearQuickView);

// Legacy: Combined actions selector
export const useQuickViewActions = () => {
  const setQuickViewItem = useQuickViewStore((state) => state.setQuickViewItem);
  const setQuickAddItem = useQuickViewStore((state) => state.setQuickAddItem);
  const clearQuickView = useQuickViewStore((state) => state.clearQuickView);

  return {
    setQuickViewItem,
    setQuickAddItem,
    clearQuickView,
  };
};
