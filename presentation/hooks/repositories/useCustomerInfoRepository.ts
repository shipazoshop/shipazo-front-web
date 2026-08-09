import { CustomerInfo, CreateCustomerInfoDto, ValidateNitResponse } from '@/domain/entities/customer-info.entity';
import { useApiQuery } from '../api/useApiQuery';
import { useApiMutation } from '../api/useApiMutation';
import { useQueryClient } from '@tanstack/react-query';

// QueryKey que coincide con lo que genera QueryKeyFactory.create(service, endpoint)
const CUSTOMER_INFO_QUERY_KEY = ['scrapper', '/customers/me'];

// Endpoint de validación de NIT: GET /customers/nit/{nit} (el nit va en la ruta).
const NIT_VALIDATION_ENDPOINT = '/customers/nit';

// Construye el path de validación para un nit dado. Única fuente del path,
// se usa con `fetchManual({ endpoint: buildNitValidationEndpoint(nit) })`.
export const buildNitValidationEndpoint = (nit: string): string =>
  `${NIT_VALIDATION_ENDPOINT}/${encodeURIComponent(nit)}`;

export function useCustomerInfoRepository() {
  const queryClient = useQueryClient();

  // Query para obtener la información del cliente
  const getCustomerInfo = () => {
    return useApiQuery<CustomerInfo>({
      service: 'scrapper',
      endpoint: '/customers/me',
      queryOptions: {
        staleTime: 10 * 60 * 1000, // 10 minutos
      },
    });
  };

  // Mutation para crear información del cliente
  const createCustomerInfo = () => {
    return useApiMutation<CustomerInfo, CreateCustomerInfoDto>({
      service: 'scrapper',
      endpoint: '/customers',
      method: 'POST',
      invalidateQueries: [CUSTOMER_INFO_QUERY_KEY],
      mutationOptions: {
        onMutate: async (newCustomerInfo) => {
          await queryClient.cancelQueries({ queryKey: CUSTOMER_INFO_QUERY_KEY });

          const previousCustomerInfo = queryClient.getQueryData<CustomerInfo>(CUSTOMER_INFO_QUERY_KEY);

          // Optimistic update
          const optimisticData: CustomerInfo = {
            id: `temp-${Date.now()}`,
            ...newCustomerInfo,
            email: "",
            userId: 'current-user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          queryClient.setQueryData<CustomerInfo>(CUSTOMER_INFO_QUERY_KEY, optimisticData);

          return { previousCustomerInfo };
        },
        onError: (error, newCustomerInfo, context: any) => {
          if (context?.previousCustomerInfo) {
            queryClient.setQueryData(CUSTOMER_INFO_QUERY_KEY, context.previousCustomerInfo);
          }
        },
        onSuccess: (data) => {
          queryClient.setQueryData<CustomerInfo>(CUSTOMER_INFO_QUERY_KEY, data);
        },
      },
    });
  };

  // Mutation para actualizar información del cliente
  // @param silent - Si true, desactiva snackbars (para guardados en segundo plano)
  const updateCustomerInfo = (id: string, silent = false) => {
    return useApiMutation<CustomerInfo, CreateCustomerInfoDto>({
      service: 'scrapper',
      endpoint: '/customers/me',
      method: 'PUT',
      showSuccessSnackbar: !silent,
      showErrorSnackbar: !silent,
      invalidateQueries: [CUSTOMER_INFO_QUERY_KEY],
      mutationOptions: {
        onMutate: async (updatedCustomerInfo) => {
          await queryClient.cancelQueries({ queryKey: CUSTOMER_INFO_QUERY_KEY });

          const previousCustomerInfo = queryClient.getQueryData<CustomerInfo>(CUSTOMER_INFO_QUERY_KEY);

          // Optimistic update
          if (previousCustomerInfo) {
            queryClient.setQueryData<CustomerInfo>(CUSTOMER_INFO_QUERY_KEY, {
              ...previousCustomerInfo,
              ...updatedCustomerInfo,
              updatedAt: new Date().toISOString(),
            });
          }

          return { previousCustomerInfo };
        },
        onError: (error, updatedCustomerInfo, context: any) => {
          if (context?.previousCustomerInfo) {
            queryClient.setQueryData(CUSTOMER_INFO_QUERY_KEY, context.previousCustomerInfo);
          }
        },
        onSuccess: (data) => {
          queryClient.setQueryData<CustomerInfo>(CUSTOMER_INFO_QUERY_KEY, data);
        },
      },
    });
  };

  // Validación de NIT (GET). Se dispara manualmente con `fetchManual({ params: { nit } })`
  // desde el botón "Validar NIT", por eso arranca deshabilitada.
  const validateNit = () => {
    return useApiQuery<ValidateNitResponse>({
      service: 'scrapper',
      endpoint: NIT_VALIDATION_ENDPOINT,
      enabled: false,
      showErrorSnackbar: false,
    });
  };

  return {
    // Queries
    getCustomerInfo,
    validateNit,

    // Mutations
    createCustomerInfo,
    updateCustomerInfo,
  };
}
