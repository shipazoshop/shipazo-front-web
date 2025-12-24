import {
  CreateOrderDto,
  CreateOrderResponse,
  GetOrdersParams,
  OrdersListResponse,
  OrderDetail,
} from '@/domain/entities/order.entity';
import { useApiQuery } from '../api/useApiQuery';
import { useApiMutation } from '../api/useApiMutation';

export function useOrdersRepository() {
  /**
   * Servicio para listar órdenes con filtros opcionales
   * GET /api/v1/orders
   */
  const getOrders = (params?: GetOrdersParams) => {
    return useApiQuery<OrdersListResponse>({
      service: 'scrapper',
      endpoint: '/orders',
      params,
      queryOptions: {
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
    });
  };

  /**
   * Servicio para obtener el detalle de una orden específica
   * GET /api/v1/orders/:orderId
   */
  const getOrderDetail = (orderId: string) => {
    return useApiQuery<OrderDetail>({
      service: 'scrapper',
      endpoint: `/orders/${orderId}`,
      enabled: !!orderId,
      queryOptions: {
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
    });
  };

  /**
   * Servicio para crear una nueva orden
   * POST /api/v1/orders
   */
  const createOrder = () => {
    return useApiMutation<CreateOrderResponse, CreateOrderDto>({
      service: 'scrapper',
      endpoint: '/orders',
      method: 'POST',
      successMessage: 'Orden creada exitosamente',
      // Invalidar la lista de órdenes después de crear una nueva
      invalidateQueries: [['scrapper', '/orders']],
    });
  };

  return {
    // Queries
    getOrders,
    getOrderDetail,

    // Mutations
    createOrder,
  };
}
