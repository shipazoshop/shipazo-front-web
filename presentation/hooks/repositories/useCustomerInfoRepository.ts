import { CustomerInfo, CreateCustomerInfoDto, UpdateCustomerInfoDto } from '@/domain/entities/customer-info.entity';
import { useApiQuery } from '../api/useApiQuery';
import { useApiMutation } from '../api/useApiMutation';
import { useQueryClient } from '@tanstack/react-query';

const CUSTOMER_INFO_QUERY_KEY = ['customer-info'];

export function useCustomerInfoRepository() {
  const queryClient = useQueryClient();

  // Query para obtener la información del cliente
  const getCustomerInfo = () => {
    return useApiQuery<CustomerInfo>({
      service: 'scrapper',
      endpoint: '/customer-info',
      queryKey: 'customer-info',
      queryOptions: {
        staleTime: 10 * 60 * 1000, // 10 minutos
      },
    });
  };

  // Mutation para crear información del cliente
  const createCustomerInfo = () => {
    return useApiMutation<CustomerInfo, CreateCustomerInfoDto>({
      service: 'scrapper',
      endpoint: '/customer-info',
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
  const updateCustomerInfo = () => {
    return useApiMutation<CustomerInfo, UpdateCustomerInfoDto>({
      service: 'scrapper',
      endpoint: '/customer-info',
      method: 'PUT',
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

  return {
    // Queries
    getCustomerInfo,

    // Mutations
    createCustomerInfo,
    updateCustomerInfo,
  };
}
