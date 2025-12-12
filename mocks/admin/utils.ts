import type { IOrder } from "@/app/(admin)/admin/orders/core/interfaces/order.interface";
import { mockOrders } from "./orders.mock";

/**
 * Índice de órdenes por orderNumber para búsquedas O(1)
 * En lugar de buscar linealmente con .find(), usamos un Map
 */
export const ordersByNumberIndex = new Map<string, IOrder>(
  mockOrders.map((order) => [order.orderNumber, order])
);

/**
 * Índice de órdenes por ID para búsquedas O(1)
 */
export const ordersByIdIndex = new Map<string, IOrder>(
  mockOrders.map((order) => [order.id, order])
);

/**
 * Obtiene una orden por su número de orden (O(1))
 * @param orderNumber - El número de orden (ej: "ORD-001")
 * @returns La orden o undefined si no existe
 */
export function getOrderByNumber(orderNumber: string): IOrder | undefined {
  return ordersByNumberIndex.get(orderNumber);
}

/**
 * Obtiene una orden por su ID (O(1))
 * @param orderId - El ID de la orden
 * @returns La orden o undefined si no existe
 */
export function getOrderById(orderId: string): IOrder | undefined {
  return ordersByIdIndex.get(orderId);
}

/**
 * Filtra órdenes por estado de pago
 * @param paymentStatus - Estado de pago ("paid" | "pending")
 * @returns Array de órdenes filtradas
 */
export function getOrdersByPaymentStatus(
  paymentStatus: "paid" | "pending"
): IOrder[] {
  return mockOrders.filter((order) => order.paymentStatus === paymentStatus);
}

/**
 * Filtra órdenes por estado de tracking
 * @param trackingStatus - Estado del tracking
 * @returns Array de órdenes filtradas
 */
export function getOrdersByTrackingStatus(
  trackingStatus: IOrder["trackingStatus"]
): IOrder[] {
  return mockOrders.filter((order) => order.trackingStatus === trackingStatus);
}
