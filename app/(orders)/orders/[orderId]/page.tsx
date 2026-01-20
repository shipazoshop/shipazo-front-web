"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { ArrowLeft, Truck, MapPin, CreditCard } from "lucide-react";
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

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();

  const { getOrderDetail } = useOrdersRepository();
  const { data, isLoading, isError } = getOrderDetail(params.orderId);
  const order = data?.data;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !order) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", py: 8 }}>
        <Typography variant="h6" color="error">
          {isError ? "Error al cargar la orden" : "Orden no encontrada"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isError
            ? "Por favor, intenta nuevamente más tarde"
            : "Verifica el identificador de la orden en la URL"}
        </Typography>
        <Button
          component={Link}
          href="/orders"
          startIcon={<ArrowLeft size={16} />}
          variant="outlined"
          sx={{
            mt: 2,
            textTransform: "none",
            borderColor: "#4a90e2",
            color: "#4a90e2",
            "&:hover": {
              borderColor: "#3a7bc8",
              bgcolor: "rgba(74, 144, 226, 0.04)",
            },
          }}
        >
          Volver a mis órdenes
        </Button>
      </Box>
    );
  }
  // Encontrar el paso actual del tracking basado en position
  const currentTrackingStage = order.tracking.find((t) => t.name === order.currentTrackingStage);
  const currentStepIndex = currentTrackingStage ? currentTrackingStage.position : 0;
  // Ordenar tracking por posición
  const sortedTracking = [...order.tracking].sort((a, b) => a.position - b.position);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Breadcrumb + header */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/home" passHref>
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ cursor: "pointer", "&:hover": { color: "#4a90e2" } }}
            >
              Tienda
            </Typography>
          </Link>
          <Link href="/orders" passHref>
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ cursor: "pointer", "&:hover": { color: "#4a90e2" } }}
            >
              Mis Órdenes
            </Typography>
          </Link>
          <Typography variant="body2" color="text.primary">
            {order.orderNumber}
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Orden {order.orderNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Realizada el{" "}
              {new Date(order.createdAt).toLocaleDateString("es-GT", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Chip
              label={
                paymentStatusConfig[order.paymentStatus]?.label || order.paymentStatus
              }
              color={paymentStatusConfig[order.paymentStatus]?.color || "info"}
              variant="outlined"
            />
            <Typography variant="body2" fontWeight={600}>
              Total: {formatGTQ(order.totalAmount)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* Información de la orden */}
        <Grid size={{ sm: 12, md: 4, lg: 3, xs: 12 }}>
          {/* Dirección de envío */}
          <Paper sx={{ p: 3, mb: 2, borderRadius: 3 }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#4a90e2",
                  color: "white",
                }}
              >
                <MapPin size={18} />
              </Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Dirección de envío
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2">{order.shippingAddress.fullAddress}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Código postal: {order.shippingAddress.postalCode}
            </Typography>
          </Paper>

          {/* Método de pago */}
          <Paper sx={{ p: 3, mb: 2, borderRadius: 3 }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#4a90e2",
                  color: "white",
                }}
              >
                <CreditCard size={18} />
              </Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Método de pago
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" fontWeight={500}>
              {order.paymentMethod}
            </Typography>
          </Paper>

          {/* Resumen de costos */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Resumen
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2">{formatGTQ(order.subtotalAmount)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Envío
                </Typography>
                <Typography variant="body2">{formatGTQ(order.shippingCost)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Impuestos
                </Typography>
                <Typography variant="body2">{formatGTQ(order.taxAmount)}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {formatGTQ(order.totalAmount)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Tracking y productos */}
        <Grid size={{ sm: 12, md: 8, lg: 9 }}>
          {/* Estado de envío */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#4a90e2",
                  color: "white",
                }}
              >
                <Truck size={20} />
              </Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Estado de envío
              </Typography>
            </Box>

            <Stepper
              activeStep={currentStepIndex}
              alternativeLabel
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
              }}
            >
              {sortedTracking.map((step) => (
                <Step key={step.stageId}>
                  <StepLabel>{step.name}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Productos */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Productos de la orden
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.itemId} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                          {item.productDetails.imageUrl && (
                            <Box
                              component="img"
                              src={item.productDetails.imageUrl}
                              alt={item.productDetails.name}
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 1,
                                objectFit: "cover",
                                bgcolor: "grey.100",
                              }}
                            />
                          )}
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {item.productDetails.name}
                            </Typography>
                            {item.productDetails.description && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {item.productDetails.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatGTQ(item.productDetails.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{item.quantity}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatGTQ(item.subtotal)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Resumen */}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="body2" fontWeight={600}>
                        Subtotal
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}>
                        {formatGTQ(order.subtotalAmount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="body2">Envío</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{formatGTQ(order.shippingCost)}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="body2">Impuestos</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{formatGTQ(order.taxAmount)}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="body2" fontWeight={700}>
                        Total
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}>
                        {formatGTQ(order.totalAmount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Botón de regreso */}
      <Box>
        <Button
          component={Link}
          href="/orders"
          startIcon={<ArrowLeft size={16} />}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "#4a90e2",
            color: "#4a90e2",
            "&:hover": {
              borderColor: "#3a7bc8",
              bgcolor: "rgba(74, 144, 226, 0.04)",
            },
          }}
        >
          Volver a mis órdenes
        </Button>
      </Box>
    </Box>
  );
}
