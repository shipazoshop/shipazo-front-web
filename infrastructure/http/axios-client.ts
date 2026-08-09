import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { HttpClient, RequestConfig } from './http-client.interface';
import { refreshAccessToken, forceLogout } from '@/infrastructure/security/session.service';

// Función que devuelve el accessToken vivo (leído del store en cada request).
export type TokenProvider = () => string | null;

// Endpoints de auth que NUNCA deben disparar un refresh (evita recursión/bucles).
const AUTH_ENDPOINTS = ['/auth/refresh', '/auth/exchange'];

// Config extendida para marcar una request ya reintentada.
type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export class AxiosHttpClient implements HttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string, private tokenProvider?: TokenProvider) {
    this.client = axios.create({
      baseURL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor: adjunta SIEMPRE el token actual del store.
    this.client.interceptors.request.use((config) => {
      const token = this.tokenProvider?.();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor: ante un 401 intenta refrescar UNA vez y reintenta.
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config as RetriableConfig | undefined;
        const url = config?.url ?? '';
        const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => url.includes(path));

        if (error.response?.status === 401 && config && !config._retry && !isAuthEndpoint) {
          config._retry = true; // solo un intento → sin bucles
          try {
            const newToken = await refreshAccessToken(); // dedup + axios pelado
            config.headers.Authorization = `Bearer ${newToken}`;
            return this.client(config); // reintento → react-query ve éxito
          } catch {
            forceLogout(); // refresh falló → cerrar sesión y al login
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config as AxiosRequestConfig);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config as AxiosRequestConfig);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config as AxiosRequestConfig);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config as AxiosRequestConfig);
    return response.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config as AxiosRequestConfig);
    return response.data;
  }
}