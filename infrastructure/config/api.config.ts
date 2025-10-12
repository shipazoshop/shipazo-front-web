export interface ApiConfig {
  products: string;
  cart: string;
  orders: string;
  auth: string;
  payments: string;
  [key: string]: string;
}

export const getApiConfig = (): ApiConfig => ({
  products: process.env.NEXT_PUBLIC_PRODUCTS_API_URL || '',
  cart: process.env.NEXT_PUBLIC_CART_API_URL || '',
  orders: process.env.NEXT_PUBLIC_ORDERS_API_URL || '',
  auth: process.env.NEXT_PUBLIC_AUTH_API_URL || '',
  payments: process.env.NEXT_PUBLIC_PAYMENTS_API_URL || '',
});

export type ApiService = keyof ApiConfig;

export const URL_DICTIONARY = {
  PRODUCTS: '/product'
}