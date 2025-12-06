import { ApiError } from '@/domain';
import { ApiErrorHandler, ApiService, HttpClientFactory } from '@/infrastructure';
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/application/stores/useAuthStore';

export type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface UseApiMutationConfig<TData, TVariables> {
  service: ApiService;
  endpoint: string;
  method?: HttpMethod;
  invalidateQueries?: string[][]; // Query keys a invalidar
  updateCache?: {
    queryKey: string[];
    updater: (oldData: any, newData: TData) => any;
  };
  mutationOptions?: Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'>;
  onSuccess?: (data: TData) => void;
  onError?: (error: ApiError) => void;
}

export function useApiMutation<TData = unknown, TVariables = unknown>({
  service,
  endpoint,
  method = 'POST',
  invalidateQueries,
  updateCache,
  mutationOptions,
  onSuccess,
  onError,
}: UseApiMutationConfig<TData, TVariables>) {
  const queryClient = useQueryClient();

  // Obtener token de autenticación del store
  const accessToken = useAuthStore((state) => state.accessToken);

  // Obtener cliente HTTP con token de autenticación si existe
  const httpClient = useMemo(
    () => HttpClientFactory.getClient(service, accessToken || ""),
    [service, accessToken]
  );

  // Error handler
  const errorHandler = useMemo(
    () => new ApiErrorHandler(
      undefined,
      undefined,
      onError
    ),
    [onError]
  );

  // Mutation function
  const mutationFn = useCallback(
    async (variables: TVariables): Promise<TData> => {
      try {
        switch (method) {
          case 'POST':
            return await httpClient.post<TData>(endpoint, variables);
          case 'PUT':
            return await httpClient.put<TData>(endpoint, variables);
          case 'PATCH':
            return await httpClient.put<TData>(endpoint, variables);
          case 'DELETE':
            return await httpClient.delete<TData>(endpoint);
          default:
            throw new Error(`Método HTTP no soportado: ${method}`);
        }
      } catch (error) {
        errorHandler.handle(error);
        throw error;
      }
    },
    [httpClient, endpoint, method, errorHandler]
  );

  const mutation = useMutation<TData, ApiError, TVariables>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidar queries relacionadas
      if (invalidateQueries) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // Actualizar cache manualmente si se especifica
      if (updateCache) {
        const oldData = queryClient.getQueryData(updateCache.queryKey);
        const newData = updateCache.updater(oldData, data);
        queryClient.setQueryData(updateCache.queryKey, newData);
      }

      // Callback de éxito
      onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      onError?.(error);
    },
    retry: false,
    ...mutationOptions,
  });

  // Utilidades adicionales
  const invalidate = useCallback((queryKeys: string[][]) => {
    queryKeys.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey });
    });
  }, [queryClient]);

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
    invalidate,
    // Información adicional
    status: mutation.status,
  };
}
