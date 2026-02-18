import { TrendingUp, ShoppingCart, Package } from "lucide-react";

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

