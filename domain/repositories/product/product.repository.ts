import { QueryResult } from "../base.repository";
import { IImportProductResponse } from "@/domain/dto/import-product.dto";

export type Product = IImportProductResponse;

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductRepository {
  getProducts(filters?: ProductFilters): QueryResult<Product[]>;
  getProductById(id: string): QueryResult<Product>;
}