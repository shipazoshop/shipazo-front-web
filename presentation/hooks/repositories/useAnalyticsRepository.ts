import {
  GetRecentPendingOrdersParams,
  RecentPendingOrdersResponse,
  OrderAverageResponse,
  OrderStatusSummaryResponse,
  MonthlySalesChartResponse,
  GetMonthlySalesChartParams,
  SalesByStoreResponse,
  GetSalesByStoreParams,
  SalesTotalResponse,
  GetSalesTotalParams,
  NetProfitResponse,
  GetNetProfitParams,
} from '@/domain/entities/order.entity';
import { useApiQuery } from '../api/useApiQuery';

export function useAnalyticsRepository() {
  /**
   * Órdenes pendientes recientes
   * GET /api/v1/analytics/orders/recent-pending
   */
  const getRecentPendingOrders = (params?: GetRecentPendingOrdersParams) => {
    return useApiQuery<RecentPendingOrdersResponse>({
      service: 'scrapper',
      endpoint: '/analytics/orders/recent-pending',
      params,
      showErrorSnackbar: false,
      queryOptions: {
        staleTime: 2 * 60 * 1000, // 2 minutos
      },
    });
  };

  /**
   * Promedio de órdenes del mes actual vs mes anterior
   * GET /api/v1/analytics/orders/average
   */
  const getOrdersAverage = () => {
    return useApiQuery<OrderAverageResponse>({
      service: 'scrapper',
      endpoint: '/analytics/orders/average',
      showErrorSnackbar: false,
      queryOptions: {
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
    });
  };

  /**
   * Resumen de estados de órdenes del mes
   * GET /api/v1/analytics/orders/status-summary
   */
  const getOrdersStatusSummary = () => {
    return useApiQuery<OrderStatusSummaryResponse>({
      service: 'scrapper',
      endpoint: '/analytics/orders/status-summary',
      showErrorSnackbar: false,
      queryOptions: {
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
    });
  };

  /**
   * Gráfica de ventas mensuales por año
   * GET /api/v1/analytics/sales/monthly-chart
   */
  const getMonthlySalesChart = (params: GetMonthlySalesChartParams) => {
    return useApiQuery<MonthlySalesChartResponse>({
      service: 'scrapper',
      endpoint: '/analytics/sales/monthly-chart',
      params,
      showErrorSnackbar: false,
      queryOptions: {
        staleTime: 10 * 60 * 1000, // 10 minutos
      },
    });
  };

  /**
   * Ventas por tienda en un rango de fechas
   * GET /api/v1/analytics/sales/by-store
   */
  const getSalesByStore = (params: GetSalesByStoreParams) => {
    return useApiQuery<SalesByStoreResponse>({
      service: 'scrapper',
      endpoint: '/analytics/sales/by-store',
      params,
      showErrorSnackbar: false,
      queryOptions: {
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
    });
  };

  /**
   * Ventas totales por periodo (mes o año)
   * GET /api/v1/analytics/sales/total
   */
  const getSalesTotal = (params: GetSalesTotalParams) => {
    return useApiQuery<SalesTotalResponse>({
      service: 'scrapper',
      endpoint: '/analytics/sales/total',
      params,
      showErrorSnackbar: false,
      queryOptions: {
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
    });
  };

  /**
   * Ganancias netas por periodo (mes o año)
   * GET /api/v1/analytics/profit/net
   */
  const getNetProfit = (params?: GetNetProfitParams) => {
    return useApiQuery<NetProfitResponse>({
      service: 'scrapper',
      endpoint: '/analytics/profit/net',
      params: params ?? { period: 'month' },
      showErrorSnackbar: false,
      queryOptions: {
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
    });
  };

  return {
    getRecentPendingOrders,
    getOrdersAverage,
    getOrdersStatusSummary,
    getMonthlySalesChart,
    getSalesByStore,
    getSalesTotal,
    getNetProfit,
  };
}
