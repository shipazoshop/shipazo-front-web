import { ApiError } from '@/domain/errors/api.errors';
import { QueryParams } from '@/domain/repositories/base.repository';
import { ApiService } from '@/infrastructure/config/api.config';
import { HttpClientFactory } from '@/infrastructure/http/http-client.factory';
import { ApiErrorHandler } from '@/infrastructure/query/error-handler';
import { QueryKeyFactory } from '@/infrastructure/query/query-key.factory';
import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

export interface UseApiQueryConfig<TData> {
  service: ApiService;
  endpoint: string;
  params?: QueryParams;
  enabled?: boolean;
  queryOptions?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>;
  onError?: (error: ApiError) => void;
}

export function useApiQuery<TData = unknown>({
  service,
  endpoint,
  params,
  enabled = true,
  queryOptions,
  onError,
}: UseApiQueryConfig<TData>) {
  const queryClient = useQueryClient();
  
  // Generar query key usando factory
  const queryKey = useMemo(
    () => QueryKeyFactory.create(service, endpoint, params),
    [service, endpoint, params]
  );

  // Obtener cliente HTTP
  const httpClient = useMemo(
    () => HttpClientFactory.getClient(service),
    [service]
  );

  // Error handler
  const errorHandler = useMemo(
    () => new ApiErrorHandler(
      undefined, // onUnauthorized manejado globalmente
      undefined, // onNotFound manejado globalmente
      onError
    ),
    [onError]
  );

  // Query function
  const queryFn = useCallback(async (): Promise<TData> => {
    try {
      return await httpClient.get<TData>(endpoint, { params });
    } catch (error) {
      errorHandler.handle(error);
      throw error;
    }
  }, [httpClient, endpoint, params, errorHandler]);

  // Configuración del query
  const query = useQuery<TData, ApiError>({
    queryKey,
    queryFn,
    enabled,
    refetchOnWindowFocus: false,
    retry: false,
    ...queryOptions,
  });

  // Utilidades
  const invalidate = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const updateCache = useCallback((updater: (old: TData | undefined) => TData) => {
    queryClient.setQueryData<TData>(queryKey, updater);
  }, [queryClient, queryKey]);

  const removeCache = useCallback(() => {
    queryClient.removeQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    data: query.data,
    isLoading: query.isLoading || query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    invalidate,
    updateCache,
    removeCache,
    // Información adicional de TanStack Query
    status: query.status,
    fetchStatus: query.fetchStatus,
    isStale: query.isStale,
  };
}
