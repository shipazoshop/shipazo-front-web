// presentation/hooks/api/useApiMutation.ts
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { MutationService, MutationMethod } from '@/application/services/MutationService';
import { ApiMutations, MutationParams } from '@/infrastructure';

export interface MutationError {
    response?: {
        status: number;
        data: { message: string };
    };
    message: string;
}

interface UseApiMutationProps<TResponse, TRequest> {
    mutationKey: string;
    method: MutationMethod;
    url: string;
    params?: Record<string, any>;
    queryParams?: Record<string, any>;
    contentType?: string;

    // Callbacks
    onSuccess?: (data: TResponse) => void;
    onError?: (error: MutationError) => void;
    onMutate?: (variables: TRequest) => void;
    onSettled?: () => void;

    // Cache management
    invalidateQueries?: string[];
    updateQueryCache?: {
        queryKey: string;
        updater: (oldData: any, newData: TResponse) => any;
    };

    // Opciones avanzadas
    mutationOptions?: Partial<UseMutationOptions<TResponse, MutationError, TRequest>>;
}

export function useApiMutation<TResponse = any, TRequest = any>({
    mutationKey,
    method,
    url,
    params,
    queryParams,
    contentType = 'application/json',
    onSuccess,
    onError,
    onMutate,
    onSettled,
    invalidateQueries,
    updateQueryCache,
    mutationOptions,
}: UseApiMutationProps<TResponse, TRequest>) {
    const queryClient = useQueryClient();
    const [isLoadingState, setIsLoadingState] = useState(false);

    // Mutation function basada en el método HTTP
    const mutationFn = useCallback(async (variables: TRequest): Promise<TResponse> => {
        const baseParams: MutationParams = {
            url,
            params,
            queryParams,
            contentType,
        };

        switch (method) {
            case 'POST':
                return await ApiMutations.post<TResponse, TRequest>({
                    ...baseParams,
                    data: variables,
                });
            case 'PUT':
                return await ApiMutations.put<TResponse, TRequest>({
                    ...baseParams,
                    data: variables,
                });
            case 'PATCH':
                return await ApiMutations.patch<TResponse, TRequest>({
                    ...baseParams,
                    data: variables,
                });
            case 'DELETE':
                return await ApiMutations.delete<TResponse>(baseParams);
            default:
                throw new Error(`Unsupported method: ${method}`);
        }
    }, [method, url, params, queryParams, contentType]);

    // Configurar mutation
    const mutation = useMutation<TResponse, MutationError, TRequest>({
        mutationKey: MutationService.generateMutationKey(mutationKey, params),
        mutationFn,

        onMutate: (variables) => {
            setIsLoadingState(true);
            onMutate?.(variables);
        },

        onSuccess: (data) => {
            // Invalidar queries relacionadas
            if (invalidateQueries && invalidateQueries.length > 0) {
                invalidateQueries.forEach(queryKey => {
                    queryClient.invalidateQueries({ queryKey: [queryKey] });
                });
            }

            // Actualizar cache específico
            if (updateQueryCache) {
                const oldData = queryClient.getQueryData([updateQueryCache.queryKey]);
                const newData = updateQueryCache.updater(oldData, data);
                queryClient.setQueryData([updateQueryCache.queryKey], newData);
            }

            onSuccess?.(data);
        },

        onError: (error) => {
            onError?.(error);
        },

        onSettled: () => {
            setIsLoadingState(false);
            onSettled?.();
        },

        retry: false,
        gcTime: 1000 * 60 * 5,
        ...mutationOptions,
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setIsLoadingState(false);
        };
    }, []);

    // Helpers para diferentes casos de uso
    const mutate = useCallback((variables: TRequest) => {
        return mutation.mutate(variables);
    }, [mutation]);

    const mutateAsync = useCallback(async (variables: TRequest) => {
        return mutation.mutateAsync(variables);
    }, [mutation]);

    const reset = useCallback(() => {
        mutation.reset();
    }, [mutation]);

    return {
        // Main actions
        mutate,
        mutateAsync,
        reset,

        // State
        data: mutation.data,
        error: mutation.error,
        isLoading: mutation.isPending || isLoadingState,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,

        // Advanced info
        status: mutation.status,
        isPending: mutation.isPending,
    };
}