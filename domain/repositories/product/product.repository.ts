import { QueryResult } from "../base.repository";

export interface Product {
    success:     boolean;
    url:         string;
    product_id:  string;
    productData: ProductData;
}

export interface ProductData {
    title:         string;
    description:   string;
    price:         string;
    currency:      string;
    brand:         string;
    stock:         boolean;
    weight:        string;
    dimensions:    string;
    images:        string[];
    price_details: PriceDetails;
}

export interface PriceDetails {
    base_price_usd:    string;
    exchange_rate:     string;
    base_price_gtq:    string;
    taxes:             Taxes;
    operational_costs: OperationalCosts;
    final_price:       string;
}

export interface OperationalCosts {
    flete:            string;
    dai:              string;
    iva:              string;
    servicio_calshop: string;
    comision_parcela: string;
    valor_cif:        string;
}

export interface Taxes {
    duty_rate: string;
}

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