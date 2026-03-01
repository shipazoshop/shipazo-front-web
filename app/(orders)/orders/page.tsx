"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { Package, Eye } from "lucide-react";
import { useOrdersRepository } from "@/presentation/hooks/repositories/useOrdersRepository";
import { formatGTQ } from "@/shared/utils";

const paymentStatusConfig: Record<
  string,
  { label: string; color: "success" | "warning" | "error" | "info" }
> = {
  paid: { label: "Pagado", color: "success" },
  pending: { label: "Pendiente", color: "warning" },
  failed: { label: "Fallido", color: "error" },
};

const trackingStatusColors: Record<
  string,
  "default" | "primary" | "secondary" | "success" | "warning" | "info"
> = {
  orden_recibida: "default",
  paquete_en_camino: "info",
  paquete_recibido_empresa: "primary",
  pedido_en_ruta: "warning",
  entregado: "success",
};

export default function OrdersPage() {
  const { getOrders } = useOrdersRepository();
  const { data, isLoading, isError } = getOrders(true);

  const orders = data?.data || [];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", py: 8 }}>
        <Typography variant="h6" color="error">
          Error al cargar las órdenes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Por favor, intenta nuevamente más tarde
        </Typography>
      </Box>
    );
  }

  const emptyState = (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 6 }}>
      <Package size={48} color="#9e9e9e" />
      <Typography variant="body2" color="text.secondary">
        No tienes órdenes aún
      </Typography>
      <Button
        component={Link}
        href="/home"
        variant="outlined"
        size="small"
        sx={{
          mt: 2,
          textTransform: "none",
          borderColor: "#4a90e2",
          color: "#4a90e2",
          "&:hover": { borderColor: "#3a7bc8", bgcolor: "rgba(74, 144, 226, 0.04)" },
        }}
      >
        Ir a la Tienda
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#4a90e2",
              color: "white",
            }}
          >
            <Package size={24} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Mis Órdenes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Consulta el estado de todas tus órdenes
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Desktop: tabla — oculta en móvil */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden", display: { xs: "none", sm: "block" } }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell><Typography variant="body2" fontWeight={700}>Número de Orden</Typography></TableCell>
                <TableCell><Typography variant="body2" fontWeight={700}>Fecha</Typography></TableCell>
                <TableCell><Typography variant="body2" fontWeight={700}>Total</Typography></TableCell>
                <TableCell><Typography variant="body2" fontWeight={700}>Productos</Typography></TableCell>
                <TableCell><Typography variant="body2" fontWeight={700}>Estado de Pago</Typography></TableCell>
                <TableCell><Typography variant="body2" fontWeight={700}>Estado de Envío</Typography></TableCell>
                <TableCell align="center"><Typography variant="body2" fontWeight={700}>Acciones</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {emptyState}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{order.correlative}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.createdAt).toLocaleDateString("es-GT", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{formatGTQ(order.totalAmount)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {order.itemsCount} {order.itemsCount === 1 ? "producto" : "productos"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={paymentStatusConfig[order.paymentStatus]?.label || order.paymentStatus}
                        color={paymentStatusConfig[order.paymentStatus]?.color || "info"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.currentTrackingStageName}
                        color={trackingStatusColors[order.currentTrackingStageName.toLowerCase()] || "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        component={Link}
                        href={`/orders/${order.correlative}`}
                        variant="outlined"
                        size="small"
                        startIcon={<Eye size={16} />}
                        sx={{
                          textTransform: "none",
                          borderColor: "#4a90e2",
                          color: "#4a90e2",
                          "&:hover": { borderColor: "#3a7bc8", bgcolor: "rgba(74, 144, 226, 0.04)" },
                        }}
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Mobile: cards — ocultas en desktop */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "column", gap: 2 }}>
        {orders.length === 0 ? (
          emptyState
        ) : (
          orders.map((order) => (
            <Paper
              key={order.id}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "#f5f5f5",
                border: "1px solid #e1e1e1",
              }}
            >
              {/* Card header: ID + badge de envío */}
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#73787d", letterSpacing: 0.5 }}>
                    ORDER ID
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#333e48", lineHeight: 1.2 }}>
                    {order.correlative}
                  </Typography>
                </Box>
                <Chip
                  label={order.currentTrackingStageName}
                  color={trackingStatusColors[order.currentTrackingStageName.toLowerCase()] || "default"}
                  size="small"
                  sx={{ fontWeight: 600, mt: 0.5 }}
                />
              </Box>

              <Divider sx={{ borderColor: "#e1e1e1" }} />

              {/* Fecha y total */}
              <Box sx={{ px: 2.5, py: 1.5, display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#73787d", display: "block" }}>
                    DATE
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#333e48", fontWeight: 500 }}>
                    {new Date(order.createdAt).toLocaleDateString("es-GT", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="caption" sx={{ color: "#73787d", display: "block" }}>
                    TOTAL
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#333e48", fontWeight: 700 }}>
                    {formatGTQ(order.totalAmount)}
                  </Typography>
                </Box>
              </Box>

              {/* Productos + estado de pago */}
              <Box sx={{ px: 2.5, pb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "#73787d" }}>
                  {order.itemsCount} {order.itemsCount === 1 ? "producto" : "productos"}
                </Typography>
                <Chip
                  label={paymentStatusConfig[order.paymentStatus]?.label || order.paymentStatus}
                  color={paymentStatusConfig[order.paymentStatus]?.color || "info"}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ borderColor: "#e1e1e1" }} />

              {/* Botón de acción */}
              <Box sx={{ px: 2.5, py: 1.5 }}>
                <Button
                  component={Link}
                  href={`/orders/${order.correlative}`}
                  variant="contained"
                  fullWidth
                  startIcon={<Eye size={16} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: "#4a90e2",
                    "&:hover": { bgcolor: "#3a7bc8" },
                  }}
                >
                  View Full Details
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {/* Pagination info */}
      {data?.meta && orders.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Mostrando {orders.length} de {data.meta.totalItems} órdenes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Página {data.meta.currentPage} de {data.meta.totalPages}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
