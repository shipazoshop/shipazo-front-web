"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";

const stats = [
  {
    title: "Ingresos Totales",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Órdenes",
    value: "2,350",
    change: "+12.5%",
    trend: "up" as const,
    icon: ShoppingCart,
  },
  {
    title: "Productos",
    value: "892",
    change: "+4.2%",
    trend: "up" as const,
    icon: Package,
  },
  {
    title: "Usuarios",
    value: "12,234",
    change: "-2.4%",
    trend: "down" as const,
    icon: Users,
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Carlos Martínez",
    amount: "$299.00",
    status: "Completado",
  },
  {
    id: "ORD-002",
    customer: "María García",
    amount: "$149.00",
    status: "Pendiente",
  },
  {
    id: "ORD-003",
    customer: "Juan Pérez",
    amount: "$499.00",
    status: "Completado",
  },
  {
    id: "ORD-004",
    customer: "Ana López",
    amount: "$199.00",
    status: "Procesando",
  },
  {
    id: "ORD-005",
    customer: "Pedro Sánchez",
    amount: "$349.00",
    status: "Completado",
  },
];

const getStatusColor = (status: string):
  | "success"
  | "warning"
  | "info"
  | "default" => {
  switch (status) {
    case "Completado":
      return "success";
    case "Pendiente":
      return "warning";
    case "Procesando":
      return "info";
    default:
      return "default";
  }
};

export default function AdminHomePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Bienvenido al panel administrativo. Aquí está un resumen de tu
          negocio.
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'space-between'}}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isUp = stat.trend === "up";

          return (
            <Grid size={{sm: 6, md: 3, lg: 2}} key={stat.title}>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {stat.title}
                    </Typography>
                    <Icon size={18} />
                  </Box>

                  <Typography variant="h5" fontWeight="bold">
                    {stat.value}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    {isUp ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: isUp ? "success.main" : "error.main",
                      }}
                    >
                      {stat.change}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 0.5 }}
                    >
                      vs mes anterior
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{sm: 6, md: 8, lg: 5}} >
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Órdenes Recientes
              </Typography>
              <Box>
                {recentOrders.map((order, index) => (
                  <Box
                    key={order.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1.5,
                      borderBottom:
                        index === recentOrders.length - 1
                          ? "none"
                          : "1px solid",
                      borderColor:
                        index === recentOrders.length - 1
                          ? "transparent"
                          : "divider",
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="body2" fontWeight={500}>
                        {order.customer}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
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
                      <Typography variant="body2" fontWeight={500}>
                        {order.amount}
                      </Typography>
                      <Chip
                        size="small"
                        label={order.status}
                        color={getStatusColor(order.status)}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{sm: 6, md: 8, lg: 5}} >
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Actividad Reciente
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      mt: 0.75,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      Nueva orden recibida
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Hace 5 minutos
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                      mt: 0.75,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      Producto agregado al inventario
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Hace 1 hora
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "info.main",
                      mt: 0.75,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      Nuevo usuario registrado
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Hace 3 horas
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "warning.main",
                      mt: 0.75,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      Alerta de inventario bajo
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Hace 5 horas
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
