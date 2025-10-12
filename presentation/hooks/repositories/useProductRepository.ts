import { Product, ProductFilters } from "@/domain/repositories/product/product.repository";
import { useApiMutation, useApiQuery } from "@/presentation";
import { IImportProductResponse } from "../../../domain/dto/import-product.dto";
import { getApiConfig, URL_DICTIONARY } from "@/infrastructure";

type ImportFromUrlDto = { url: string };

const SCRAPER_PRODUCT_URL = getApiConfig()

export function useProductRepository() {
  const getProducts = (filters?: ProductFilters) => {
    return useApiQuery<Product[]>({
      service: 'products',
      endpoint: '/products',
      params: filters,
      queryOptions: {
        staleTime: 5 * 60 * 1000,
      },
    });
  };

  const getProductByURL = (url: string, queryKey: string, enabled = true) => {
    return useApiQuery<Product>({
      service: 'products',
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

  const createProduct = () => {
    return useApiMutation<Product, Partial<Product>>({
      service: 'products',
      endpoint: '/products',
      method: 'POST',
      invalidateQueries: [
        ['products', '/products'], // Invalida la lista de productos
      ],
      onSuccess: (data) => {
        console.log('Producto creado:', data);
      },
    });
  };

  const updateProduct = (id: string) => {
    return useApiMutation<Product, Partial<Product>>({
      service: 'products',
      endpoint: `/products/${id}`,
      method: 'PUT',
      invalidateQueries: [
        ['products', '/products'],
        ['products', `/products/${id}`],
      ],
    });
  };

  const deleteProduct = (id: string) => {
    return useApiMutation<void, void>({
      service: 'products',
      endpoint: `/products/${id}`,
      method: 'DELETE',
      invalidateQueries: [
        ['products', '/products'],
      ],
      // Actualizar cache optimísticamente
      updateCache: {
        queryKey: ['products', '/products'],
        updater: (oldData: Product[] | undefined, _newData) => {
          if (!oldData) return oldData;
          return oldData.filter(p => p.productData.title !== id);
        },
      },
    });
  };

  const importProductFromUrl = () => {
    if (!SCRAPER_PRODUCT_URL.products) {
      throw new Error("Falta NEXT_PUBLIC_API_SCRAPER_URL en .env");
    }

    return useApiMutation<IImportProductResponse, ImportFromUrlDto>({
      service: "products",
      endpoint: SCRAPER_PRODUCT_URL.products + URL_DICTIONARY.PRODUCTS,
      method: "POST",
      invalidateQueries: [
        ["products", "/products"],
      ],
      updateCache: {
        queryKey: ["products", "/products"],
        updater: (old: any[] | undefined, newData: IImportProductResponse) => {
          if (!old) return old;
          const p = newData.productData;
          const id = newData.product_id;

          const idx = old.findIndex((x) => x.product_id === id || x?.productData?.title === p.title);
          const normalized = {
            product_id: id,
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
        console.log("Producto importado:", data.product_id, data.productData?.title);
      },
    });
  };



  return {
    // Queries
    getProducts,
    getProductByURL,
    // Mutations
    createProduct,
    updateProduct,
    deleteProduct,
    importProductFromUrl,
  };
}