"use client";

import { memo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { mockDashboardStats, mockRecentOrders, type IDashboardStat, type IRecentOrder } from "@/mocks/admin";
import { alpha } from "@mui/material/styles";

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

// Memoizar el componente de tarjeta de estadística con diseño moderno
const StatCard = memo(function StatCard({ stat }: { stat: IDashboardStat }) {
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

// Memoizar el componente de fila de orden reciente
const RecentOrderRow = memo(function RecentOrderRow({
  order,
  isLast
}: {
  order: IRecentOrder;
  isLast: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
        px: 1.5,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: alpha("#ff3d3d", 0.04),
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography variant="body2" fontWeight={600}>
          {order.customer}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}
        >
          {order.id}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ minWidth: 80, textAlign: "right" }}>
          {order.amount}
        </Typography>
        <Chip
          size="small"
          label={order.status}
          color={getStatusColor(order.status)}
          sx={{ fontWeight: 600, minWidth: 90 }}
        />
      </Box>
    </Box>
  );
});

// Memoizar el componente de actividad con diseño moderno
const ActivityItem = memo(function ActivityItem({
  color,
  title,
  time,
}: {
  color: string;
  title: string;
  time: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: alpha("#f5f5f5", 0.5),
        },
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          bgcolor: color,
          mt: 0.75,
          boxShadow: `0 0 0 4px ${alpha(color, 0.15)}`,
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
          {time}
        </Typography>
      </Box>
    </Box>
  );
});

export default function AdminHomePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3}>
        {mockDashboardStats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </Grid>

      {/* Órdenes recientes y actividad */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
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
                Órdenes Recientes
              </Typography>
              <Box>
                {mockRecentOrders.map((order, index) => (
                  <RecentOrderRow
                    key={order.id}
                    order={order}
                    isLast={index === mockRecentOrders.length - 1}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Actividad Reciente
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <ActivityItem
                  color="#ff3d3d"
                  title="Nueva orden recibida"
                  time="Hace 5 minutos"
                />
                <ActivityItem
                  color="#4caf50"
                  title="Producto agregado al inventario"
                  time="Hace 1 hora"
                />
                <ActivityItem
                  color="#004ec3"
                  title="Nuevo usuario registrado"
                  time="Hace 3 horas"
                />
                <ActivityItem
                  color="#FCB500"
                  title="Alerta de inventario bajo"
                  time="Hace 5 horas"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
