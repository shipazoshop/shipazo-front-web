import { ApiError } from '@/domain/errors/api.errors';
import { QueryParams } from '@/domain/repositories/base.repository';
import { ApiService } from '@/infrastructure/config/api.config';
import { HttpClientFactory } from '@/infrastructure/http/http-client.factory';
import { ApiErrorHandler } from '@/infrastructure/query/error-handler';
import { QueryKeyFactory } from '@/infrastructure/query/query-key.factory';
import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/application/stores/useAuthStore';
import { useShowSnackbar } from '@/application/stores/useSnackbarStore';

export interface UseApiQueryConfig<TData> {
  service: ApiService;
  endpoint: string;
  params?: QueryParams;
  queryKey?: string;
  enabled?: boolean;
  queryOptions?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>;
  onError?: (error: ApiError) => void;
  showErrorSnackbar?: boolean; // Mostrar snackbar de error automáticamente (default: true)
}

export interface ManualFetchParams {
  params?: QueryParams;
  endpoint?: string; // Opcional: permite cambiar el endpoint
  [key: string]: any;
}


export function useApiQuery<TData = unknown>({
  service,
  endpoint,
  params,
  queryKey: customQueryKey,
  enabled = true,
  queryOptions,
  onError,
  showErrorSnackbar = true,
}: UseApiQueryConfig<TData>) {
  const queryClient = useQueryClient();
  const showSnackbar = useShowSnackbar();

  // Estado para el fetch manual
  const [manualFetchState, setManualFetchState] = useState<{
    isLoading: boolean;
    error: ApiError | null;
    data: TData | null;
  }>({
    isLoading: false,
    error: null,
    data: null,
  });

  // Generar query key usando factory o usar el customQueryKey
  const queryKey = useMemo(
    () => QueryKeyFactory.create(service, endpoint, customQueryKey ?? params),
    [service, endpoint, params, customQueryKey]
  );

  // Obtener token de autenticación y estado de hidratación del store
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Obtener cliente HTTP con token de autenticación si existe
  const httpClient = useMemo(
    () => HttpClientFactory.getClient(service, accessToken || ""),
    [service, accessToken]
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
  // Solo habilitar la query si el store está hidratado y la condición enabled es true
  const query = useQuery<TData, ApiError>({
    queryKey,
    queryFn,
    enabled: isHydrated && enabled,
    refetchOnWindowFocus: false,
    retry: false,
    ...queryOptions,
  });

  // Ref para evitar mostrar el mismo error múltiples veces
  const lastShownErrorRef = useRef<string | null>(null);

  // Efecto para mostrar snackbar cuando hay error
  useEffect(() => {
    if (query.isError && query.error && showErrorSnackbar) {
      const errorMessage = query.error.message || 'Error al cargar los datos';

      // Solo mostrar si el mensaje de error cambió
      if (lastShownErrorRef.current !== errorMessage) {
        lastShownErrorRef.current = errorMessage;
        showSnackbar(errorMessage, 'error');
      }
    } else if (!query.isError) {
      // Resetear cuando no hay error
      lastShownErrorRef.current = null;
    }
  }, [query.isError, query.error?.message, showErrorSnackbar]);

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

  const fetchManual = useCallback(
    async (manualParams?: ManualFetchParams): Promise<TData> => {
      setManualFetchState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        // Usar endpoint personalizado o el endpoint base
        const targetEndpoint = manualParams?.endpoint || endpoint;

        // Combinar params base con params manuales
        const finalParams = manualParams?.params || params;

        // Hacer el request
        const data = await httpClient.get<TData>(targetEndpoint, {
          params: finalParams,
        });

        // Generar la key para este fetch manual
        const manualQueryKey = customQueryKey
          ? QueryKeyFactory.create(service, targetEndpoint, customQueryKey)
          : QueryKeyFactory.create(service, targetEndpoint, finalParams);

        // Actualizar el cache con los nuevos datos
        queryClient.setQueryData<TData>(manualQueryKey, data);

        // También invalidar la query original si es necesario
        await queryClient.invalidateQueries({ queryKey });

        setManualFetchState({
          isLoading: false,
          error: null,
          data,
        });

        return data;
      } catch (error: any) {
        errorHandler.handle(error);

        setManualFetchState({
          isLoading: false,
          error: error as ApiError,
          data: null,
        });

        throw error;
      }
    },
    [
      httpClient,
      endpoint,
      params,
      customQueryKey,
      service,
      queryClient,
      queryKey,
      errorHandler,
    ]
  );

  // Resetear estado de manual fetch
  const resetManualFetch = useCallback(() => {
    setManualFetchState({
      isLoading: false,
      error: null,
      data: null,
    });
  }, [])

  const { isLoading, isFetching, ...rest } = query;

  // Estados combinados: query + manual fetch
  const combinedIsLoading = isLoading || isFetching || manualFetchState.isLoading;
  const combinedError = query.error || manualFetchState.error;


  return {
    // Estados principales
    data: query.data,
    isLoading: combinedIsLoading,
    isError: query.isError || manualFetchState.error !== null,
    error: combinedError,

    // Funciones principales
    refetch: query.refetch,
    invalidate,
    updateCache,
    removeCache,

    // 🔥 Manual fetch
    fetchManual,
    resetManualFetch,

    // Estados específicos (para casos avanzados)
    queryLoading: isLoading || isFetching,
    manualLoading: manualFetchState.isLoading,
    queryError: query.error,
    manualError: manualFetchState.error,
    manualData: manualFetchState.data,

    // Información adicional de TanStack Query
    queryKey,
    ...rest,
  };
}
