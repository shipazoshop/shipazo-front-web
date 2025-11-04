/**
 * Optimized hook for loading products with lazy loading
 * This reduces initial bundle size by only loading products when needed
 */

import { useEffect, useState } from 'react';

// Type definition for products (adjust based on your actual product type)
type Product = any;

let productsCache: {
  products1?: Product[];
  products2?: Product[];
  products3?: Product[];
  products4?: Product[];
  products5?: Product[];
  products6?: Product[];
  products7?: Product[];
  products8?: Product[];
  products9?: Product[];
  allProducts?: Product[];
} | null = null;

let loadingPromise: Promise<any> | null = null;

/**
 * Lazy loads and caches product data
 * Products are only loaded once and cached for subsequent calls
 */
export function useProducts() {
  const [products, setProducts] = useState<typeof productsCache>(productsCache);
  const [isLoading, setIsLoading] = useState(!productsCache);

  useEffect(() => {
    if (productsCache) {
      setProducts(productsCache);
      setIsLoading(false);
      return;
    }

    if (!loadingPromise) {
      setIsLoading(true);
      loadingPromise = import('@/shared/constants/products').then((module) => {
        productsCache = {
          products1: module.products1,
          products2: module.products2,
          products3: module.products3,
          products4: module.products4,
          products5: module.products5,
          products6: module.products6,
          products7: module.products7,
          products8: module.products8,
          products9: module.products9,
          allProducts: module.allProducts,
        };
        return productsCache;
      });
    }

    loadingPromise
      .then((loadedProducts) => {
        setProducts(loadedProducts);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load products:', error);
        setIsLoading(false);
      });
  }, []);

  return { products, isLoading };
}

/**
 * Preload products in the background
 * Call this when you want to start loading products before they're needed
 */
export function preloadProducts() {
  if (!productsCache && !loadingPromise) {
    loadingPromise = import('@/shared/constants/products').then((module) => {
      productsCache = {
        products1: module.products1,
        products2: module.products2,
        products3: module.products3,
        products4: module.products4,
        products5: module.products5,
        products6: module.products6,
        products7: module.products7,
        products8: module.products8,
        products9: module.products9,
        allProducts: module.allProducts,
      };
      return productsCache;
    });
  }
  return loadingPromise;
}

/**
 * Get products synchronously (for backwards compatibility)
 * Returns null if products haven't been loaded yet
 */
export function getProductsSync() {
  return productsCache;
}
