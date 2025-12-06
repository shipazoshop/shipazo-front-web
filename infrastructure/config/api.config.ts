export interface ApiConfig {
  scrapper: string;
  [key: string]: string;
}

export const getApiConfig = (): ApiConfig => ({
  scrapper: process.env.NEXT_PUBLIC_PRODUCTS_API_URL || '',
  // cart: process.env.NEXT_PUBLIC_CART_API_URL || '',
  // orders: process.env.NEXT_PUBLIC_ORDERS_API_URL || '',
  // auth: process.env.NEXT_PUBLIC_AUTH_API_URL || '',
  // payments: process.env.NEXT_PUBLIC_PAYMENTS_API_URL || '',
});

export type ApiService = keyof ApiConfig;

export const URL_DICTIONARY = {
  PRODUCTS: '/scraper',
  CACHED_PRODUCTS: '/cached-products',
  AUTH: '/auth/google/login'
}