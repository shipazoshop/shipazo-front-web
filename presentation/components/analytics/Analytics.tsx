"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAnalyticsRepository } from "@/presentation/hooks/repositories/useAnalyticsRepository";
import { SalesByStoreItem } from "@/domain/entities/order.entity";

const STORE_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const parseFormattedNumber = (value: string): number =>
  Number(value.replaceAll(",", ""));

const StoreTooltip = ({ active, item }: any) => {
  if (!active || !item) return null;
  const itemWithType = item as SalesByStoreItem
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "10px 14px" }}>
      <p style={{ margin: 0, fontWeight: 700, marginBottom: 4, textTransform: "capitalize" }}>{itemWithType?.storeName}</p>
      <p style={{ margin: 0, color: "#4F46E5" }}>
        Ventas: <strong>GTQ {itemWithType?.totalSales?.toLocaleString()}</strong>
      </p>
      <p style={{ margin: 0, color: "#10B981" }}>
        Compras: <strong>{itemWithType?.purchaseCount}</strong>
      </p>
    </div>
  );
};

const SalesTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "10px 14px" }}>
      <p style={{ margin: 0, fontWeight: 700, marginBottom: 4 }}>{label}</p>
      <p style={{ margin: 0, color: "#4F46E5" }}>
        Ventas: <strong>GTQ {data.sales?.toLocaleString()}</strong>
      </p>
      <p style={{ margin: 0, color: "#10B981" }}>
        Ganancia: <strong>GTQ {data.profit?.toLocaleString()}</strong>
      </p>
    </div>
  );
};

type StorePeriod = "month" | "year";

const getStoreDateRange = (period: StorePeriod) => {
  const now = new Date();
  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }
  const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

export default function Analytics() {
  const currentYear = new Date().getFullYear();
  const [storePeriod, setStorePeriod] = useState<StorePeriod>("month");

  const storeDateRange = useMemo(() => getStoreDateRange(storePeriod), [storePeriod]);

  const { getMonthlySalesChart, getSalesByStore, getSalesTotal, getNetProfit } = useAnalyticsRepository();
  const { data: salesChartData, isLoading: isLoadingChart } = getMonthlySalesChart({ year: currentYear });
  const { data: salesByStoreData } = getSalesByStore(storeDateRange);
  const { data: salesTotalData } = getSalesTotal({ period: 'year' });
  const { data: netProfitData } = getNetProfit();

  const salesTotal = salesTotalData?.data;
  const salesTotalChange = salesTotal?.percentageChange;
  const netProfit = netProfitData?.data;
  const netProfitChange = netProfit?.percentageChange;

  const storeChartData = useMemo(() => (salesByStoreData?.data), [salesByStoreData]);
  console.log(storeChartData);
  const chartData = useMemo(() => {
    if (!salesChartData?.data?.months) return [];
    return salesChartData.data.months.map((m) => ({
      month: m.month,
      sales: parseFormattedNumber(m.totalSales),
      profit: parseFormattedNumber(m.totalProfit),
    }));
  }, [salesChartData]);

  // Progressive rendering: show charts one by one for better perceived performance
  const [visibleCharts, setVisibleCharts] = useState({
    metrics: true,
    lineChart: false,
    pieChart: false,
    areaChart: false,
    barChart: false,
    table: false,
  });

  useEffect(() => {
    // Stagger chart rendering for smoother experience
    const timers = [
      setTimeout(() => setVisibleCharts((prev) => ({ ...prev, lineChart: true })), 50),
      setTimeout(() => setVisibleCharts((prev) => ({ ...prev, pieChart: true })), 100),
      setTimeout(() => setVisibleCharts((prev) => ({ ...prev, areaChart: true })), 150),
      setTimeout(() => setVisibleCharts((prev) => ({ ...prev, barChart: true })), 200),
      setTimeout(() => setVisibleCharts((prev) => ({ ...prev, table: true })), 250),
    ];

    return () => {
      for (const timer of timers) {
        clearTimeout(timer);
      }
    };
  }, []);

  // Memoize chart configurations to prevent unnecessary re-renders
  const chartConfig = useMemo(() => ({
    tooltipStyle: {
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
    },
    gridColor: "#f0f0f0",
    axisColor: "#666",
  }), []);

  const salesTotalNotNull = salesTotalChange !== null && salesTotal !== undefined;

  return (
    <div className="analytics-dashboard">
      <div className="mb-4">
        <h3 className="fw-bold mb-2">Sales Analytics Dashboard</h3>
        <p className="text-muted">
          Overview of your sales performance and key metrics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Total en ventas</p>
                  <h4 className="fw-bold mb-0">
                    {salesTotal ? `GTQ ${salesTotal.currentPeriod.total.toLocaleString()}` : "-"}
                  </h4>
                </div>
                <div className="bg-primary bg-opacity-10 p-2 rounded">
                  <i className="icon-dollar-sign text-primary fs-24" />
                </div>
              </div>
              <div className="mt-2">
                <span className={`badge ${salesTotalNotNull && salesTotalChange >= 0 ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}>
                  {salesTotalNotNull ? `${salesTotalChange >= 0 ? "+" : ""}${salesTotalChange.toFixed(1)}%` : "-"}
                </span>
                <span className="text-muted small ms-2">vs last year</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Ganancia Neta</p>
                  <h4 className="fw-bold mb-0">
                    {netProfit ? `GTQ ${netProfit.currentPeriod.netProfit.toLocaleString()}` : "-"}
                  </h4>
                </div>
                <div className="bg-danger bg-opacity-10 p-2 rounded">
                  <i className="icon-activity text-danger fs-24" />
                </div>
              </div>
              <div className="mt-2">
                <span className={`badge ${netProfitChange !== undefined && netProfitChange !== null && netProfitChange >= 0 ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}>
                  {netProfitChange !== undefined && netProfitChange !== null ? `${netProfitChange >= 0 ? "+" : ""}${netProfitChange.toFixed(1)}%` : "-"}
                </span>
                <span className="text-muted small ms-2">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="row g-3 mb-4">
        {/* Monthly Sales Trend */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Ventas Mensuales {salesChartData?.data?.year ?? currentYear}</h5>
              {visibleCharts.lineChart && !isLoadingChart && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                    <XAxis dataKey="month" stroke={chartConfig.axisColor} />
                    <YAxis stroke={chartConfig.axisColor} />
                    <Tooltip content={<SalesTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      name="Ventas"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      dot={{ fill: "#4F46E5", r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                  <div className="spinner-border text-primary">
                    <span className="visually-hidden">Loading chart...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ventas por Tienda */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Ventas por Tienda</h5>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "auto" }}
                  value={storePeriod}
                  onChange={(e) => setStorePeriod(e.target.value as StorePeriod)}
                >
                  <option value="month">Mes</option>
                  <option value="year">Año</option>
                </select>
              </div>
              {visibleCharts.pieChart && storeChartData?.stores?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={storeChartData?.stores?.map(i => ({ name: i.storeName, value: i.percentage }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value?.toFixed(1)}%`}
                      outerRadius={80}
                      dataKey="value"
                      animationDuration={800}
                    >
                      {storeChartData?.stores.map((entry, index) => (
                        <Cell key={`cell-${entry.storeName}`} fill={STORE_COLORS[index % STORE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={(s) => <StoreTooltip active={s.active} item={storeChartData?.stores?.find(i => i.storeName === s?.payload?.[0]?.name)} />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                  <div className="spinner-border text-primary">
                    <span className="visually-hidden">Loading chart...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
