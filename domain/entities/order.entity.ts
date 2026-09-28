// Entidades para Órdenes

import type { PriceDetails } from "@/domain/dto/import-product.dto";
import { OrderStatus } from "../types/orderStatus.enum";

export interface ProductDetails {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  additionalInfo?: Record<string, any>;
  productSpecification?: string; // Especificación del producto (talla, color, medida, etc.)
  priceDetails: PriceDetails;
}

export interface OrderProduct {
  storeLink: string;
  store: string;
  productDetails: ProductDetails;
  quantity: number;
}

export interface CreateOrderDto {
  products: OrderProduct[];
  shippingAddressId: string;
  paymentMethod: string;
  nit: string; // "CF" para consumidor final, o el NIT especificado
}

export interface OrderItem {
  itemId: string;
  storeLink: string;
  productDetails: ProductDetails;
  quantity: number;
  subtotal: number;
}

export interface TrackingStage {
  stageId: string;
  name: string;
  status: string;
  position: number;
  updatedAt: string;
  updatedBy: string;
  notes?: string;
}

export interface ShippingAddress {
  addressId: string;
  fullAddress: string;
  postalCode: string;
}

export interface OrderDetail {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  userId: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentId: string;
  currentTrackingStage: string;
  tracking: TrackingStage[];
  items: OrderItem[];
  subtotalAmount: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  deliveryGuide?: string; // "Transporte: numero-de-guia" (si ya fue asignada)
  /** URL del PDF en el servidor de FEL. Vacía si la factura no se certificó. */
  invoicePdfUrl?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: OrderDetail;
}

// Certificación de factura (FEL): POST /orders/{orderId}/invoice
export interface CertifyInvoiceData {
  invoiceId: string;
  orderId: string;
  status: string;
  environment: string;
  uuid: string;
  serie: string;
  numero: string;
  pdfUrl: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  receptorNit: string;
  receptorNombre: string;
  certifiedAt: string;
  errorMessage: string | null;
}

export interface CertifyInvoiceResponse {
  success: boolean;
  message: string;
  data: CertifyInvoiceData;
}

export interface Order {
  id: string;
  correlative: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  currentTrackingStageName: string;
  createdAt: string;
  updatedAt: string;
  itemsCount: number;
}

export interface OrdersListMeta {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface OrdersListResponse {
  success: boolean;
  message: string;
  data: Order[];
  meta: OrdersListMeta;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: OrderStatus;
  orderNumber?: string;
  paymentStatus?: string;
}

export interface UpdateOrderTrackingDto {
  newTrackingStageId: string;
}

export interface TrackingStageDetailed {
  stageId: string;
  name: string;
  description: string;
  position: number;
  status: 'completed' | 'current' | 'pending';
  updatedAt: string;
  updatedByUserId: string;
  updatedByUserName: string | null;
  notes: string | null;
  completedAt: string | null;
}

export interface UpdateOrderTrackingResponse {
  orderId: string;
  correlative: string;
  currentStageId: string;
  currentStageName: string;
  tracking: TrackingStageDetailed[];
}

// Guía de transporte: PUT /orders/{orderId}/delivery-guide
// Formato del valor: "Transporte: numero-de-guia" (ej. "Cargo Expreso: 12345").
export interface UpdateDeliveryGuideDto {
  deliveryGuide: string;
}

export interface UpdateDeliveryGuideResponse {
  orderId: string;
  correlative: string;
  deliveryGuide: string;
}

// Interfaz para órdenes pendientes recientes (Analytics)
export interface RecentPendingOrder {
  orderId: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface RecentPendingOrdersData {
  count: number;
  orders: RecentPendingOrder[];
}

export interface RecentPendingOrdersResponse {
  success: boolean;
  message: string;
  data: RecentPendingOrdersData;
}

export interface GetRecentPendingOrdersParams {
  limit?: number;
}

// Interfaz para promedio de órdenes (Analytics)
export interface OrderAverageMonth {
  average: number;
  count: number;
  label: string;
}

export interface OrderAverageData {
  currentMonth: OrderAverageMonth;
  previousMonth: OrderAverageMonth;
  percentageChange: number;
}

export interface OrderAverageResponse {
  success: boolean;
  message: string;
  data: OrderAverageData;
}

// Interfaz para resumen de estados de órdenes (Analytics)
export interface OrderStatusSummaryData {
  month: string;
  completed: number;
  pending: number;
  total: number;
  completionRate: number;
}

export interface OrderStatusSummaryResponse {
  success: boolean;
  message: string;
  data: OrderStatusSummaryData;
}

// Interfaz para gráfica de ventas mensuales (Analytics)
export interface MonthlySalesChartMonth {
  month: string;
  totalSales: string;
  totalProfit: string;
}

export interface MonthlySalesChartData {
  year: number;
  months: MonthlySalesChartMonth[];
}

export interface MonthlySalesChartResponse {
  success: boolean;
  message: string;
  data: MonthlySalesChartData;
}

export interface GetMonthlySalesChartParams {
  year: number;
}

// Interfaz para ventas por tienda (Analytics)
export interface SalesByStoreItem {
  storeName: string;
  totalSales: number;
  purchaseCount: number;
  percentage: number;
}

export interface SalesByStoreData {
  totalSales: number;
  stores: SalesByStoreItem[];
}

export interface SalesByStoreResponse {
  success: boolean;
  message: string;
  data: SalesByStoreData;
}

export interface GetSalesByStoreParams {
  startDate: string;
  endDate: string;
}

// Interfaz para ventas totales por periodo (Analytics)
export interface SalesTotalPeriod {
  total: number;
  label: string;
}

export interface SalesTotalData {
  currentPeriod: SalesTotalPeriod;
  previousPeriod: SalesTotalPeriod;
  percentageChange: number;
}

export interface SalesTotalResponse {
  success: boolean;
  message: string;
  data: SalesTotalData;
}

export interface GetSalesTotalParams {
  period: 'month' | 'year';
}

// Interfaz para ganancias netas por periodo (Analytics)
export interface NetProfitPeriod {
  netProfit: number;
  label: string;
  totalRevenue: number;
  operationalCosts: number;
  taxes: number;
}

export interface NetProfitData {
  currentPeriod: NetProfitPeriod;
  previousPeriod: NetProfitPeriod;
  percentageChange: number;
}

export interface NetProfitResponse {
  success: boolean;
  message: string;
  data: NetProfitData;
}

export interface GetNetProfitParams {
  period: 'month' | 'year';
}
