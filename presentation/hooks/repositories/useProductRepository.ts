import { Product, ProductFilters } from "@/domain/repositories/product/product.repository";
import { useApiMutation, useApiQuery } from "@/presentation";

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

  const getProductByURL = (url: string, enabled = true, queryKey: string) => {
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

  return {
    // Queries
    getProducts,
    getProductById: getProductByURL,
    // Mutations
    createProduct,
    updateProduct,
    deleteProduct,
  };
}