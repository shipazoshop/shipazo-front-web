"use client";

import { memo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ArrowUpRight, ArrowDownRight, ShoppingCart, TrendingUp, Package, CheckCircle, type LucideIcon } from "lucide-react";
import { alpha } from "@mui/material/styles";
import { useAnalyticsRepository } from "@/presentation/hooks/repositories/useAnalyticsRepository";
import type { RecentPendingOrder } from "@/domain/entities/order.entity";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

const getStatusColor = (status: string):
  | "success"
  | "warning"
  | "info"
  | "default" => {
  switch (status) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "processing":
      return "info";
    default:
      return "default";
  }
};

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  hideChip?: boolean;
}

const StatCard = memo(function StatCard({ stat }: { stat: StatCardProps }) {
  const Icon = stat.icon;
  const isUp = stat.trend === "up";

  return (
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Card
        sx={{
          background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
            borderColor: "primary.main",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #ff3d3d 0%, #ff6b6b 100%)",
          },
        }}
      >
        <CardContent sx={{ pt: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${alpha("#ff3d3d", 0.1)} 0%, ${alpha("#ff6b6b", 0.05)} 100%)`,
                color: "primary.main",
              }}
            >
              <Icon size={24} strokeWidth={2} />
            </Box>
            {
              stat.hideChip ? null :
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 999,
                    bgcolor: isUp ? alpha("#4caf50", 0.1) : alpha("#f44336", 0.1),
                  }}
                >
                  {isUp ? (
                    <ArrowUpRight size={14} color="#4caf50" />
                  ) : (
                    <ArrowDownRight size={14} color="#f44336" />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      color: isUp ? "success.main" : "error.main",
                    }}
                  >
                    {stat.change}
                  </Typography>
                </Box>
            }
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 0.5,
              background: "linear-gradient(135deg, #333333 0%, #505050 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {stat.value}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
          >
            {stat.title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
});

// Memoizar el componente de fila de orden pendiente
const RecentOrderRow = memo(function RecentOrderRow({
  order,
}: {
  order: RecentPendingOrder;
}) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/admin/orders/${order.orderId}`}
      style={{ textDecoration: "none", color: "inherit", display: "block", width: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
          px: 1.5,
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            bgcolor: alpha("#ff3d3d", 0.04),
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="body2" fontWeight={600}>
            {order.customerName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}
          >
            {order.orderId}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
            {formattedDate}
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ minWidth: 80, textAlign: "right" }}>
            GTQ {order.totalAmount.toFixed(2)}
          </Typography>
          <Chip
            size="small"
            label={order.status}
            color={getStatusColor(order.status)}
            sx={{ fontWeight: 600, minWidth: 90 }}
          />
        </Box>
      </Box>
    </Link>
  );
});

export default function AdminHomePage() {
  const { getRecentPendingOrders, getOrdersAverage, getOrdersStatusSummary } = useAnalyticsRepository();
  const { data: recentPendingData, isLoading } = getRecentPendingOrders({ limit: 10 });
  const { data: averageData } = getOrdersAverage();
  const { data: summaryData } = getOrdersStatusSummary();

  const pendingOrders = recentPendingData?.data?.orders ?? [];
  const avgCurrent = averageData?.data?.currentMonth;
  const avgChange = averageData?.data?.percentageChange;
  const avgTrend = avgChange !== undefined && avgChange >= 0 ? "up" as const : "down" as const;
  const change = (avgChange !== undefined && avgChange !== null) ? `${avgChange >= 0 ? "+" : ""}${avgChange?.toFixed(1)}%` : "0%";

  const summary = summaryData?.data;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3}>
        <StatCard
          stat={{
            title: "Total Órdenes",
            value: summary ? summary.total : "-",
            change: summary ? summary.month : "-",
            trend: "up",
            icon: ShoppingCart,
          }}
        />
        <StatCard
          stat={{
            title: "Promedio de Órdenes",
            value: avgCurrent ? `GTQ ${avgCurrent.average.toFixed(2)}` : "-",
            change: change,
            trend: avgTrend,
            icon: TrendingUp,
          }}
        />
        <StatCard
          stat={{
            title: "Órdenes Pendientes",
            value: pendingOrders.length,
            change: "-",
            trend: "down",
            icon: Package,
            hideChip: true
          }}
        />
        <StatCard
          stat={{
            title: "Completadas",
            value: summary ? summary.completed : "-",
            change: summary ? summary.month : "-",
            trend: "up",
            icon: CheckCircle,
          }}
        />
      </Grid>

      {/* Órdenes pendientes recientes */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Órdenes Pendientes Recientes
              </Typography>

              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : pendingOrders.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                  No hay órdenes pendientes
                </Typography>
              ) : (
                <Box>
                  {pendingOrders.map((order) => (
                    <RecentOrderRow
                      key={order.orderId}
                      order={order}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
