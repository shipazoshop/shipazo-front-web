import { TrendingUp, TrendingDown, ShoppingCart, Package } from "lucide-react";

export interface IDashboardStat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: typeof TrendingUp;
}

export const mockDashboardStats: IDashboardStat[] = [
  {
    title: "Total Orders",
    value: "1,234",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Revenue",
    value: "GTQ 45,231",
    change: "+8.2%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Pending Orders",
    value: "23",
    change: "-4.3%",
    trend: "down",
    icon: Package,
  },
  {
    title: "Completed",
    value: "1,211",
    change: "+15.3%",
    trend: "up",
    icon: TrendingUp,
  },
];

export interface IRecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: "completed" | "pending" | "processing";
  date: string;
}

export const mockRecentOrders: IRecentOrder[] = [
  {
    id: "ORD-001",
    customer: "Juan Pérez",
    amount: "GTQ 120.50",
    status: "pending",
    date: "2025-11-10",
  },
  {
    id: "ORD-002",
    customer: "María García",
    amount: "GTQ 89.99",
    status: "completed",
    date: "2025-11-11",
  },
  {
    id: "ORD-003",
    customer: "Carlos López",
    amount: "GTQ 245.00",
    status: "processing",
    date: "2025-11-12",
  },
  {
    id: "ORD-004",
    customer: "Ana Martínez",
    amount: "GTQ 120.50",
    status: "pending",
    date: "2025-11-12",
  },
  {
    id: "ORD-005",
    customer: "Luis Rodríguez",
    amount: "GTQ 189.99",
    status: "pending",
    date: "2025-11-13",
  },
];
