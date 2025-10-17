"use client";
import { allProducts } from "@/shared/constants/products";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartProduct } from "@/domain/mappers/product.mapper";
import { mapImportProductToCartProduct, mapLegacyProductToImportProduct } from "@/domain/mappers/product.mapper";
import type { IImportProductResponse } from "@/domain/dto/import-product.dto";

type Product = (typeof allProducts)[number];

type ContextValue = {
  cartProducts: CartProduct[];
  setCartProducts: Dispatch<SetStateAction<CartProduct[]>>;
  totalPrice: number;
  addProductToCart: (product: IImportProductResponse, qty?: number, isModal?: boolean) => void;
  addProductToCartById: (id: number, qty?: number, isModal?: boolean) => void;
  isAddedToCartProducts: (id: string) => boolean;
  removeFromWishlist: (id: number) => void;
  addToWishlist: (id: number) => void;
  isAddedtoWishlist: (id: number) => boolean;
  quickViewItem: Product;
  wishList: number[];
  setQuickViewItem: Dispatch<SetStateAction<Product>>;
  quickAddItem: number;
  setQuickAddItem: Dispatch<SetStateAction<number>>;
  addToCompareItem: (id: number) => void;
  isAddedtoCompareItem: (id: number) => boolean;
  removeFromCompareItem: (id: number) => void;
  compareItem: number[];
  setCompareItem: Dispatch<SetStateAction<number[]>>;
  updateQuantity: (id: string, qty: number) => void;
};

const dataContext = createContext<ContextValue | undefined>(undefined);

export const useContextElement = (): ContextValue => {
  const context = useContext(dataContext);
  if (!context) {
    throw new Error("useContextElement must be used within a Context provider");
  }
  return context;
};

type ContextProviderProps = {
  children: ReactNode;
};

const CART_STORAGE_KEY = "cartList";
const WISHLIST_STORAGE_KEY = "wishlist";

const findProductById = (id: number): Product | undefined =>
  allProducts.find((product) => product.id === id);

const findCartProductById = (id: string, cartProducts: CartProduct[]): CartProduct | undefined =>
  cartProducts.find((product) => product.id === id);

const readStorageArray = (key: string): number[] | CartProduct[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as number[] | CartProduct[]) : [];
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage`, error);
    return [];
  }
};

const writeStorageArray = (key: string, value: unknown[]): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to write ${key} to localStorage`, error);
  }
};

export default function Context({ children }: ContextProviderProps) {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [wishList, setWishList] = useState<number[]>([1, 2, 3]);
  const [compareItem, setCompareItem] = useState<number[]>([1, 2, 3, 4]);
  const [quickViewItem, setQuickViewItem] = useState<Product>(allProducts[0]);
  const [quickAddItem, setQuickAddItem] = useState<number>(1);

  const totalPrice = useMemo(
    () =>
      cartProducts.reduce(
        (accumulator, product) => accumulator + product.quantity * (product.price ?? 0),
        0
      ),
    [cartProducts]
  );

  const isAddedToCartProducts = (id: string): boolean =>
    cartProducts.some((product) => product.id === id);

  /**
   * Método principal unificado para agregar productos al carrito
   * Acepta únicamente IImportProductResponse
   */
  const addProductToCart = (product: IImportProductResponse, qty = 1, isModal = true): void => {
    if (isAddedToCartProducts(product.product_id)) {
      return;
    }
    const productToAdd = mapImportProductToCartProduct(product, qty);
    setCartProducts((previous) => [...previous, productToAdd]);
    if (isModal) {
      // openCartModal();
    }
  };

  /**
   * Método helper para agregar productos legacy por ID
   * Convierte productos legacy a IImportProductResponse antes de agregarlos
   * @deprecated Migrar a usar addProductToCart con IImportProductResponse directamente
   */
  const addProductToCartById = (id: number, qty = 1, isModal = true): void => {
    const stringId = String(id);
    if (isAddedToCartProducts(stringId)) {
      return;
    }
    const legacyProduct = findProductById(id);
    if (!legacyProduct) {
      return;
    }
    // Convertir producto legacy a IImportProductResponse
    const importProduct = mapLegacyProductToImportProduct(legacyProduct);
    addProductToCart(importProduct, qty, isModal);
  };

  const updateQuantity = (id: string, qty: number): void => {
    if (!isAddedToCartProducts(id) || qty < 1) {
      return;
    }

    setCartProducts((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity: qty,
          }
          : item
      )
    );
  };

  const addToWishlist = (id: number): void => {
    setWishList((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
    // openWishlistModal();
  };

  const removeFromWishlist = (id: number): void => {
    setWishList((previous) => previous.filter((item) => item !== id));
  };

  const addToCompareItem = (id: number): void => {
    setCompareItem((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  };

  const removeFromCompareItem = (id: number): void => {
    setCompareItem((previous) => previous.filter((item) => item !== id));
  };

  const isAddedtoWishlist = (id: number): boolean => wishList.includes(id);
  const isAddedtoCompareItem = (id: number): boolean => compareItem.includes(id);

  useEffect(() => {
    setCartProducts(readStorageArray(CART_STORAGE_KEY) as CartProduct[]);
    setWishList(readStorageArray(WISHLIST_STORAGE_KEY) as number[]);
  }, []);

  useEffect(() => {
    writeStorageArray(CART_STORAGE_KEY, cartProducts);
  }, [cartProducts]);

  useEffect(() => {
    writeStorageArray(WISHLIST_STORAGE_KEY, wishList);
  }, [wishList]);

  const contextValue: ContextValue = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    addProductToCartById,
    isAddedToCartProducts,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    updateQuantity,
  };

  return <dataContext.Provider value={contextValue}>{children}</dataContext.Provider>;
}
