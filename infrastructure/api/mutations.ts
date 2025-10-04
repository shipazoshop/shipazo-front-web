// infrastructure/api/mutations.ts
import { apiClient } from './client';
import { ResponseType } from 'axios';

export interface MutationParams {
    url: string;
    data?: any;
    params?: Record<string, any>;
    queryParams?: Record<string, any>;
    responseType?: ResponseType;
    contentType?: string;
}

export class ApiMutations {
    static async post<TResponse, TRequest = any>(
        params: MutationParams & { data: TRequest }
    ): Promise<TResponse> {
        const response = await apiClient.post<TResponse>(
            params.url,
            params.data,
            {
                params: params.queryParams,
                responseType: params.responseType,
                headers: {
                    'Content-Type': params.contentType || 'application/json',
                },
            }
        );
        return response.data;
    }

    static async put<TResponse, TRequest = any>(
        params: MutationParams & { data: TRequest }
    ): Promise<TResponse> {
        const response = await apiClient.put<TResponse>(
            params.url,
            params.data,
            {
                params: params.queryParams,
                responseType: params.responseType,
                headers: {
                    'Content-Type': params.contentType || 'application/json',
                },
            }
        );
        return response.data;
    }

    static async patch<TResponse, TRequest = any>(
        params: MutationParams & { data: TRequest }
    ): Promise<TResponse> {
        const response = await apiClient.patch<TResponse>(
            params.url,
            params.data,
            {
                params: params.queryParams,
                responseType: params.responseType,
                headers: {
                    'Content-Type': params.contentType || 'application/json',
                },
            }
        );
        return response.data;
    }

    static async delete<TResponse>(params: MutationParams): Promise<TResponse> {
        const response = await apiClient.delete<TResponse>(params.url, {
            params: params.queryParams,
            responseType: params.responseType,
        });
        return response.data;
    }
}