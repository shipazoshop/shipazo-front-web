import { Address, CreateAddressDto, UpdateAddressDto, UpdateAddressResponse } from '@/domain/entities/address.entity';
import { useApiQuery } from '../api/useApiQuery';
import { useApiMutation } from '../api/useApiMutation';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// QueryKey que coincide con lo que genera QueryKeyFactory.create(service, endpoint)
const ADDRESSES_QUERY_KEY = ['scrapper', '/customers/addresses'];

export function useAddressRepository() {
  const queryClient = useQueryClient();

  // Query para obtener todas las direcciones
  const getAddresses = () => {
    return useApiQuery<Address[]>({
      service: 'scrapper',
      endpoint: '/customers/addresses',
      queryOptions: {
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
    });
  };

  // Mutation para crear una nueva dirección
  const createAddress = () => {
    return useApiMutation<Address, CreateAddressDto>({
      service: 'scrapper',
      endpoint: '/customers/addresses',
      method: 'POST',
      invalidateQueries: [ADDRESSES_QUERY_KEY],
      mutationOptions: {
        onMutate: async (newAddress) => {
          // Cancelar queries en vuelo
          await queryClient.cancelQueries({ queryKey: ADDRESSES_QUERY_KEY });

          // Snapshot del valor anterior
          const previousAddresses = queryClient.getQueryData<Address[]>(ADDRESSES_QUERY_KEY);

          // Optimistic update
          if (previousAddresses) {
            const optimisticAddress: Address = {
              id: `temp-${Date.now()}`,
              ...newAddress,
              userId: 'current-user',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old) => {
              if (!old) return [optimisticAddress];

              // Si es la primera dirección o es marcada como predeterminada
              if (newAddress.isDefault) {
                return [...old.map(addr => ({ ...addr, isDefault: false })), optimisticAddress];
              }

              return [...old, optimisticAddress];
            });
          }

          return { previousAddresses };
        },
        onError: (error, newAddress, context: any) => {
          // Rollback en caso de error
          if (context?.previousAddresses) {
            queryClient.setQueryData(ADDRESSES_QUERY_KEY, context.previousAddresses);
          }
        },
        onSuccess: (data) => {
          const newAdress = data.address
          // Actualizar con datos reales del servidor
          queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old) => {
            if (!old) return [data];

            // Reemplazar el optimistic update con datos reales
            const filtered = old.filter((addr) => !addr.id.startsWith('temp-'));

            if (data.isDefault) {
              return [...filtered.map(addr => ({ ...addr, isDefault: false })), data];
            }

            return [...filtered, data];
          });
        },
      },
    });
  };

  // Mutation para actualizar una dirección
  const updateAddress = (id: string) => {
    return useApiMutation<UpdateAddressResponse, UpdateAddressDto>({
      service: 'scrapper',
      endpoint: `/customers/addresses/${id}`,
      method: 'PUT',
      invalidateQueries: [ADDRESSES_QUERY_KEY],
      mutationOptions: {
        onMutate: async (updatedAddress) => {

          await queryClient.cancelQueries({ queryKey: ADDRESSES_QUERY_KEY });

          const previousAddresses = queryClient.getQueryData<Address[]>(ADDRESSES_QUERY_KEY);

          // Optimistic update
          queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old) => {
            if (!old) return [];

            return old.map((addr) => {
              if (addr.id === id) {
                return { ...addr, ...updatedAddress, updatedAt: new Date().toISOString() };
              }

              // Si se marca como predeterminada, desmarcar las demás
              if (updatedAddress.isDefault && addr.id !== id) {
                return { ...addr, isDefault: false };
              }

              return addr;
            });
          });

          return { previousAddresses };
        },
        onError: (error, updatedAddress, context: any) => {
          if (context?.previousAddresses) {
            queryClient.setQueryData(ADDRESSES_QUERY_KEY, context.previousAddresses);
          }
        },
        onSuccess: (data) => {
          // Actualizar con datos reales del servidor
          queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old) => {
            if (!old) return [data.address];

            return old.map((addr) => {
              if (addr.id === data.address.id) {
                return data.address;
              }

              if (data.address.isDefault && addr.id !== data.address.id) {
                return { ...addr, isDefault: false };
              }

              return addr;
            });
          });
        },
      },
    });
  };

  // Mutation para eliminar una dirección
  const deleteAddress = (id: string) => {
    return useApiMutation<void, { id: string }>({
      service: 'scrapper',
      endpoint: `/customers/addresses/${id}`,
      method: 'DELETE',
      invalidateQueries: [ADDRESSES_QUERY_KEY],
      mutationOptions: {
        onMutate: async (variables) => {
          await queryClient.cancelQueries({ queryKey: ADDRESSES_QUERY_KEY });

          const previousAddresses = queryClient.getQueryData<Address[]>(ADDRESSES_QUERY_KEY);

          // Optimistic update
          queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old) => {
            if (!old) return [];
            return old.filter((addr) => addr.id !== variables.id);
          });

          return { previousAddresses };
        },
        onError: (error, variables, context: any) => {
          if (context?.previousAddresses) {
            queryClient.setQueryData(ADDRESSES_QUERY_KEY, context.previousAddresses);
          }
        },
      },
    });
  };

  // Mutation para marcar como predeterminada
  const setDefaultAddress = (id: string) => {
    return useApiMutation<UpdateAddressResponse, { id: string }>({
      service: 'scrapper',
      endpoint: `/customers/addresses/${id}/set-default`,
      method: 'PATCH',
      invalidateQueries: [ADDRESSES_QUERY_KEY],
      mutationOptions: {
        onMutate: async (variables) => {
          await queryClient.cancelQueries({ queryKey: ADDRESSES_QUERY_KEY });

          const previousAddresses = queryClient.getQueryData<Address[]>(ADDRESSES_QUERY_KEY);

          // Optimistic update
          queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old) => {
            if (!old) return [];

            return old.map((addr) => ({
              ...addr,
              isDefault: addr.id === variables.id,
            }));
          });

          return { previousAddresses };
        },
        onError: (error, variables, context: any) => {
          if (context?.previousAddresses) {
            queryClient.setQueryData(ADDRESSES_QUERY_KEY, context.previousAddresses);
          }
        },
        onSuccess: (data) => {
          debugger
          // Actualizar con datos reales del servidor
          queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old) => {
            if (!old) return [data.address];

            return old.map((addr) => ({
              ...addr,
              isDefault: addr.id === data.address.id,
            }));
          });
        },
      },
    });
  };

  return {
    // Queries
    getAddresses,

    // Mutations
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
