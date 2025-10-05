import { QueryResult } from "../base.repository";
import { Product, ProductFilters, ProductRepository } from "./product.repository";

export class ProductRepositoryImpl implements ProductRepository {
  getProducts(filters?: ProductFilters): QueryResult<Product[]> {
    // Este método retorna la configuración, el hook se usa en el componente
    return {
      service: 'products',
      endpoint: '/products',
      params: filters,
    } as any;
  }

  getProductById(id: string): QueryResult<Product> {
    return {
      service: 'products',
      endpoint: `/products/${id}`,
    } as any;
  }
}