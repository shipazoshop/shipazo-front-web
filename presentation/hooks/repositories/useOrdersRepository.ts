import {
  CertifyInvoiceResponse,
  CreateOrderDto,
  CreateOrderResponse,
  GetOrdersParams,
  OrdersListResponse,
  UpdateDeliveryGuideDto,
  UpdateDeliveryGuideResponse,
  UpdateOrderTrackingDto,
  UpdateOrderTrackingResponse,
} from '@/domain/entities/order.entity';
import { useApiQuery } from '../api/useApiQuery';
import { useApiMutation } from '../api/useApiMutation';

export function useOrdersRepository() {
  /**
   * Servicio para listar órdenes con filtros opcionales
   * GET /api/v1/orders
   */
  const getOrders = (showError = false, params?: GetOrdersParams) => {
    return useApiQuery<OrdersListResponse>({
      service: 'scrapper',
      endpoint: '/orders',
      params,
      showErrorSnackbar: showError,
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
    return useApiQuery<CreateOrderResponse>({
      service: 'scrapper',
      endpoint: `/orders/track/${orderId}`,
      enabled: !!orderId,
      queryOptions: {
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
    });
  };

  /**
   * Servicio para crear una nueva orden
   * POST /api/v1/orders
   * @param silent - Si true, desactiva snackbars (el caller maneja errores)
   */
  const createOrder = (silent = false) => {
    return useApiMutation<CreateOrderResponse, CreateOrderDto>({
      service: 'scrapper',
      endpoint: '/orders',
      method: 'POST',
      showSuccessSnackbar: !silent,
      showErrorSnackbar: !silent,
      successMessage: 'Orden creada exitosamente',
      // Invalidar la lista de órdenes después de crear una nueva
      invalidateQueries: [['scrapper', '/orders']],
    });
  };

  /**
   * Servicio para actualizar el tracking de una orden
   * PATCH /api/v1/orders/:orderId/tracking
   */
  const updateOrderTracking = (orderId: string) => {
    return useApiMutation<UpdateOrderTrackingResponse, UpdateOrderTrackingDto>({
      service: 'scrapper',
      endpoint: `/orders/${orderId}/tracking`,
      method: 'PATCH',
      successMessage: 'Estado de tracking actualizado exitosamente',
      // Invalidar la lista de órdenes y el detalle de la orden después de actualizar
      invalidateQueries: [
        ['scrapper', '/orders'],
        ['scrapper', `/orders/track/${orderId}`],
      ],
    });
  };

  /**
   * Servicio para actualizar la guía de transporte de una orden
   * PUT /api/v1/orders/:orderId/delivery-guide
   * El error (400/403/404/inesperado) se muestra vía el snackbar de useApiMutation.
   */
  const updateDeliveryGuide = (orderId: string) => {
    return useApiMutation<UpdateDeliveryGuideResponse, UpdateDeliveryGuideDto>({
      service: 'scrapper',
      endpoint: `/orders/${orderId}/delivery-guide`,
      method: 'PUT',
      successMessage: 'Guía de transporte actualizada exitosamente',
      // Invalidar la lista y el detalle para reflejar la guía guardada
      invalidateQueries: [
        ['scrapper', '/orders'],
        ['scrapper', `/orders/track/${orderId}`],
      ],
    });
  };

  /**
   * Servicio para certificar la factura (FEL) de una orden
   * POST /api/v1/orders/:orderId/invoice
   * Silent: los errores se manejan como no bloqueantes en /order-details.
   */
  const certifyInvoice = (orderId: string) => {
    return useApiMutation<CertifyInvoiceResponse, void>({
      service: 'scrapper',
      endpoint: `/orders/${orderId}/invoice`,
      method: 'POST',
      showSuccessSnackbar: false,
      showErrorSnackbar: false,
    });
  };

  return {
    // Queries
    getOrders,
    getOrderDetail,

    // Mutations
    createOrder,
    updateOrderTracking,
    updateDeliveryGuide,
    certifyInvoice,
  };
}
