import { ApiError } from '@/domain';
import { ApiErrorHandler, ApiService, HttpClientFactory } from '@/infrastructure';
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/application/stores/useAuthStore';
import { useShowSnackbar } from '@/application/stores/useSnackbarStore';

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
  showSuccessSnackbar?: boolean; // Mostrar snackbar de éxito automáticamente (default: true)
  showErrorSnackbar?: boolean; // Mostrar snackbar de error automáticamente (default: true)
  successMessage?: string; // Mensaje personalizado de éxito
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
  showSuccessSnackbar = true,
  showErrorSnackbar = true,
  successMessage,
}: UseApiMutationConfig<TData, TVariables>) {
  const queryClient = useQueryClient();
  const showSnackbar = useShowSnackbar();

  // Obtener token de autenticación y estado de hidratación del store
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Generar mensaje de éxito basado en el método HTTP
  const getSuccessMessage = useCallback(() => {
    if (successMessage) return successMessage;

    switch (method) {
      case 'POST':
        return 'Creado exitosamente';
      case 'PUT':
      case 'PATCH':
        return 'Actualizado exitosamente';
      case 'DELETE':
        return 'Eliminado exitosamente';
      default:
        return 'Operación exitosa';
    }
  }, [method, successMessage]);

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
      // Esperar a que el store esté hidratado antes de ejecutar la mutación
      if (!isHydrated) {
        // Esperar un breve momento para que se complete la hidratación
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Si después del timeout sigue sin estar hidratado, continuar de todas formas
        // pero advertir en consola
        if (!useAuthStore.getState().isHydrated) {
          console.warn('Mutation ejecutada antes de que el store esté completamente hidratado');
        }
      }

      try {
        switch (method) {
          case 'POST':
            return await httpClient.post<TData>(endpoint, variables);
          case 'PUT':
            return await httpClient.put<TData>(endpoint, variables);
          case 'PATCH':
            return await httpClient.patch<TData>(endpoint, variables);
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
    [httpClient, endpoint, method, errorHandler, isHydrated]
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

      // Mostrar snackbar de éxito si está habilitado
      if (showSuccessSnackbar) {
        showSnackbar(getSuccessMessage(), 'success');
      }

      // Callback de éxito
      onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      // Mostrar snackbar de error si está habilitado
      if (showErrorSnackbar) {
        const errorMessage = error.message || 'Ha ocurrido un error';
        showSnackbar(errorMessage, 'error');
      }

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
