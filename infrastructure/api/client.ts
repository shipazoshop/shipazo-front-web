import axios, { ResponseType } from 'axios';

export interface ApiGetParams {
    url: string;
    responseType?: ResponseType;
    authToken?: string;
    params?: Record<string, any>;
    queryParams?: Record<string, any>;
}

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function apiGet<T>({
    url,
    responseType = 'json',
    params = {},
    queryParams = {},
}: ApiGetParams): Promise<T> {
    const response = await apiClient.get<T>(url, {
        params: queryParams,
        responseType,
        ...params,
    });
    return response.data;
}