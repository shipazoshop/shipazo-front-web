// Products
export { mockProducts } from "./products.mock";

// Orders
export { mockOrders } from "./orders.mock";

// Dashboard Stats
export { mockDashboardStats } from "./stats.mock";
export type { IDashboardStat } from "./stats.mock";

// Utils para búsquedas optimizadas
export {
  ordersByNumberIndex,
  ordersByIdIndex,
  getOrderByNumber,
  getOrderById,
  getOrdersByPaymentStatus,
  getOrdersByTrackingStatus,
} from "./utils";
