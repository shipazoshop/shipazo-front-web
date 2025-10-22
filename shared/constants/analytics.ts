// Mock data for sales analytics dashboard

export interface MonthlySales {
  month: string;
  sales: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface TopProduct {
  name: string;
  units: number;
  revenue: number;
  category: string;
}

export interface WeeklySales {
  week: string;
  sales: number;
}

export interface CategoryDistribution {
  category: string;
  value: number;
  color: string;
}

export interface Metrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalProfit: number;
  growthRate: number;
}

// Monthly sales data for the last 12 months
export const monthlySalesData: MonthlySales[] = [
  { month: "Jan", sales: 145, revenue: 45000, cost: 28000, profit: 17000 },
  { month: "Feb", sales: 168, revenue: 52000, cost: 31000, profit: 21000 },
  { month: "Mar", sales: 192, revenue: 61000, cost: 36000, profit: 25000 },
  { month: "Apr", sales: 178, revenue: 56000, cost: 33000, profit: 23000 },
  { month: "May", sales: 210, revenue: 68000, cost: 40000, profit: 28000 },
  { month: "Jun", sales: 235, revenue: 78000, cost: 45000, profit: 33000 },
  { month: "Jul", sales: 258, revenue: 85000, cost: 48000, profit: 37000 },
  { month: "Aug", sales: 242, revenue: 79000, cost: 46000, profit: 33000 },
  { month: "Sep", sales: 228, revenue: 74000, cost: 43000, profit: 31000 },
  { month: "Oct", sales: 265, revenue: 89000, cost: 51000, profit: 38000 },
  { month: "Nov", sales: 298, revenue: 102000, cost: 58000, profit: 44000 },
  { month: "Dec", sales: 325, revenue: 115000, cost: 65000, profit: 50000 },
];

// Top 10 best-selling products
export const topProductsData: TopProduct[] = [
  { name: "Wireless Headphones", units: 342, revenue: 68400, category: "Electronics" },
  { name: "Smart Watch Pro", units: 298, revenue: 89400, category: "Electronics" },
  { name: "Yoga Mat Premium", units: 285, revenue: 14250, category: "Sports" },
  { name: "Coffee Maker Deluxe", units: 268, revenue: 40200, category: "Home" },
  { name: "Running Shoes", units: 245, revenue: 29400, category: "Sports" },
  { name: "Laptop Stand", units: 232, revenue: 11600, category: "Office" },
  { name: "Water Bottle", units: 218, revenue: 6540, category: "Sports" },
  { name: "Desk Lamp LED", units: 205, revenue: 10250, category: "Office" },
  { name: "Backpack Travel", units: 192, revenue: 19200, category: "Travel" },
  { name: "Phone Case Ultra", units: 178, revenue: 5340, category: "Accessories" },
];

// Weekly sales for the last 8 weeks
export const weeklySalesData: WeeklySales[] = [
  { week: "Week 1", sales: 58 },
  { week: "Week 2", sales: 72 },
  { week: "Week 3", sales: 65 },
  { week: "Week 4", sales: 81 },
  { week: "Week 5", sales: 78 },
  { week: "Week 6", sales: 92 },
  { week: "Week 7", sales: 88 },
  { week: "Week 8", sales: 96 },
];

// Category distribution
export const categoryDistributionData: CategoryDistribution[] = [
  { category: "Electronics", value: 35, color: "#4F46E5" },
  { category: "Sports", value: 25, color: "#10B981" },
  { category: "Home", value: 18, color: "#F59E0B" },
  { category: "Office", value: 12, color: "#EF4444" },
  { category: "Travel", value: 6, color: "#8B5CF6" },
  { category: "Accessories", value: 4, color: "#EC4899" },
];

// Key metrics
export const metricsData: Metrics = {
  totalRevenue: 904400,
  totalOrders: 2744,
  averageOrderValue: 329.65,
  totalProfit: 370000,
  growthRate: 24.5,
};
