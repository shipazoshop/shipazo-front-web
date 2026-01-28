import { Product, ProductFilters } from "@/domain/repositories/product/product.repository";
import { useApiMutation, useApiQuery } from "@/presentation";
import { getApiConfig, URL_DICTIONARY } from "@/infrastructure";
import { IImportProductResponse } from "../../../domain/dto/import-product.dto";

type ImportFromUrlDto = { url: string };

const SCRAPER_PRODUCT_URL = getApiConfig()

export function useProductRepository() {
  const getProducts = (filters?: ProductFilters) => {
    return useApiQuery<Product[]>({
      service: 'scrapper',
      endpoint: '/products',
      params: filters,
      queryOptions: {
        staleTime: 5 * 60 * 1000,
      },
    });
  };

  const getProductByURL = (url: string, queryKey: string, enabled = true) => {
    return useApiQuery<Product>({
      service: 'scrapper',
      queryKey,
      endpoint: URL_DICTIONARY.PRODUCTS,
      enabled: enabled,
      params: {
        url
      },
      queryOptions: {
        staleTime: 10 * 60 * 1000,
      },
    });
  };

  const getCachedProducts = (queryKey: string, enabled = true, page: number = 1, limit: number = 10) => {
    return useApiQuery<Product[]>({
      service: 'scrapper',
      queryKey,
      endpoint: SCRAPER_PRODUCT_URL.scrapper + URL_DICTIONARY.CACHED_PRODUCTS,
      enabled: enabled,
      params: {
        page,
        limit
      },
      queryOptions: {
        staleTime: 10 * 60 * 1000,
      },
    })
  }

  const importProductFromUrl = () => {
    if (!SCRAPER_PRODUCT_URL.scrapper) {
      throw new Error("Falta NEXT_PUBLIC_PRODUCTS_API_URL en .env");
    }

    return useApiMutation<IImportProductResponse, ImportFromUrlDto>({
      service: "scrapper",
      endpoint: SCRAPER_PRODUCT_URL.scrapper + URL_DICTIONARY.PRODUCTS,
      method: "POST",
    });
  };



  return {
    // Queries
    getProducts,
    getProductByURL,
    getCachedProducts,
    // Mutations
    importProductFromUrl,
  };
}