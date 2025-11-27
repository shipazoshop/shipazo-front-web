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
      endpoint: `/products`,
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
    return useApiQuery<any>({
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
      throw new Error("Falta NEXT_PUBLIC_API_SCRAPER_URL en .env");
    }

    return useApiMutation<IImportProductResponse, ImportFromUrlDto>({
      service: "scrapper",
      endpoint: SCRAPER_PRODUCT_URL.scrapper + URL_DICTIONARY.PRODUCTS,
      method: "POST",
      invalidateQueries: [
        ["products", "/products"],
      ],
      updateCache: {
        queryKey: ["products", "/products"],
        updater: (old: any[] | undefined, newData: IImportProductResponse) => {
          if (!old) return old;
          const p = newData.productData;
          const id = newData.productData.product_id;

          const idx = old.findIndex((x) => x.productData?.product_id === id || x?.productData?.title === p.title);
          const normalized = {
            url: newData.url,
            productData: p,
          };
          if (idx >= 0) {
            const copy = old.slice();
            copy[idx] = { ...old[idx], ...normalized };
            return copy;
          }
          return [normalized, ...old];
        },
      },
      onSuccess: (data) => {
        console.log("Producto importado:", data.productData.product_id, data.productData?.title);
      },
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