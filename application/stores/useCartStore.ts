"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartProduct } from "@/domain/mappers/product.mapper";
import {
  mapImportProductToCartProduct,
  mapLegacyProductToImportProduct,
} from "@/domain/mappers/product.mapper";
import type { IImportProductResponse } from "@/domain/dto/import-product.dto";

// Lazy load del archivo products.ts para no bloquear el hilo principal
let productsCache: any[] | null = null;

const getProducts = async () => {
  if (productsCache) return productsCache;
  const { allProducts } = await import("@/shared/constants/products");
  productsCache = allProducts;
  return allProducts;
};

type Product = any; // Tipo inferido del archivo products

interface CartStore {
  // State
  cartProducts: CartProduct[];

  // Computed
  totalPrice: number;

  // Actions
  addProductToCart: (product: IImportProductResponse, qty?: number, isModal?: boolean) => void;
  addProductToCartById: (id: number, qty?: number, isModal?: boolean) => Promise<void>;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isAddedToCartProducts: (id: string) => boolean;

  // Internal helpers
  _calculateTotalPrice: () => void;
}

const findProductById = async (id: number): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find((product) => product.id === id);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cartProducts: [],
      totalPrice: 0,

      // Actions
      addProductToCart: (product: IImportProductResponse, qty = 1, isModal = true) => {
        const { cartProducts } = get();
        const productId = product.productData.product_id;

        // Check if already in cart
        if (cartProducts.some((p) => p.productData.product_id === productId)) {
          return;
        }

        const productToAdd = mapImportProductToCartProduct(product, qty);

        set((state) => {
          const newCartProducts = [...state.cartProducts, productToAdd];
          const newTotalPrice = newCartProducts.reduce(
            (acc, p) => acc + p.quantity * (p.productData.price_details.calculatedPriceGtq ?? 0),
            0
          );

          return {
            cartProducts: newCartProducts,
            totalPrice: newTotalPrice,
          };
        });

        // TODO: Open cart modal if isModal is true
        // if (isModal) {
        //   openCartModal();
        // }
      },

      addProductToCartById: async (id: number, qty = 1, isModal = true) => {
        const { cartProducts, addProductToCart } = get();
        const stringId = String(id);

        // Check if already in cart
        if (cartProducts.some((p) => p.productData.product_id === stringId)) {
          return;
        }

        const legacyProduct = await findProductById(id);
        if (!legacyProduct) {
          return;
        }

        // Convert legacy product to IImportProductResponse
        const importProduct = mapLegacyProductToImportProduct(legacyProduct);
        addProductToCart(importProduct, qty, isModal);
      },

      updateQuantity: (id: string, qty: number) => {
        if (qty < 1) return;

        set((state) => {
          const newCartProducts = state.cartProducts.map((item) =>
            item.productData.product_id === id ? { ...item, quantity: qty } : item
          );

          const newTotalPrice = newCartProducts.reduce(
            (acc, p) => acc + p.quantity * (p.productData.price_details.calculatedPriceGtq ?? 0),
            0
          );

          return {
            cartProducts: newCartProducts,
            totalPrice: newTotalPrice,
          };
        });
      },

      removeFromCart: (id: string) => {
        set((state) => {
          const newCartProducts = state.cartProducts.filter((item) => item.productData.product_id !== id);
          const newTotalPrice = newCartProducts.reduce(
            (acc, p) => acc + p.quantity * (p.productData.price_details.calculatedPriceGtq ?? 0),
            0
          );

          return {
            cartProducts: newCartProducts,
            totalPrice: newTotalPrice,
          };
        });
      },

      clearCart: () => {
        set({ cartProducts: [], totalPrice: 0 });
      },

      isAddedToCartProducts: (id: string) => {
        const { cartProducts } = get();
        return cartProducts.some((product) => product.productData.product_id === id);
      },

      _calculateTotalPrice: () => {
        set((state) => ({
          totalPrice: state.cartProducts.reduce(
            (acc, p) => acc + p.quantity * (p.productData.price_details.calculatedPriceGtq ?? 0),
            0
          ),
        }));
      },
    }),
    {
      name: "cart-storage", // name of the item in localStorage
      partialize: (state) => ({
        cartProducts: state.cartProducts,
      }),
      onRehydrateStorage: () => (state) => {
        // Recalculate totalPrice after rehydration
        if (state) {
          state._calculateTotalPrice();
        }
      },
    }
  )
);

// Selectors for optimized rendering
export const useCartProducts = () => useCartStore((state) => state.cartProducts);
export const useCartTotalPrice = () => useCartStore((state) => state.totalPrice);
export const useCartLength = () => useCartStore((state) => state.cartProducts.length);

// Individual action selectors (recommended approach - no object creation)
export const useAddProductToCart = () => useCartStore((state) => state.addProductToCart);
export const useAddProductToCartById = () => useCartStore((state) => state.addProductToCartById);
export const useUpdateQuantity = () => useCartStore((state) => state.updateQuantity);
export const useRemoveFromCart = () => useCartStore((state) => state.removeFromCart);
export const useClearCart = () => useCartStore((state) => state.clearCart);
export const useIsAddedToCartProducts = () => useCartStore((state) => state.isAddedToCartProducts);

// Legacy: Combined actions selector (use individual selectors above for better performance)
export const useCartActions = () => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);
  const addProductToCartById = useCartStore((state) => state.addProductToCartById);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const isAddedToCartProducts = useCartStore((state) => state.isAddedToCartProducts);

  return {
    addProductToCart,
    addProductToCartById,
    updateQuantity,
    removeFromCart,
    clearCart,
    isAddedToCartProducts,
  };
};
