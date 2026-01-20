"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
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

import { ArrowLeft, Save, Truck, MapPin, CreditCard, ExternalLink } from "lucide-react";
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

  const { getOrderDetail, updateOrderTracking } = useOrdersRepository();
  const { data, isLoading, isError } = getOrderDetail(params.orderId);
  const order = data?.data;

  // Mutación para actualizar tracking
  const { mutate: updateTracking, isLoading: isUpdating } = updateOrderTracking(params.orderId);

  // Ordenar tracking por posición
  const sortedTracking = order ? [...order.tracking].sort((a, b) => a.position - b.position) : [];

  // Estado local para el tracking que el admin puede modificar
  const [trackingStatus, setTrackingStatus] = useState<string>("");

  // Sincronizar el estado local cuando se carga la orden
  if (order && !trackingStatus) {
    setTrackingStatus(order.currentTrackingStage);
  }

  const handleTrackingChange = (event: SelectChangeEvent) => {
    setTrackingStatus(event.target.value);
  };

  const handleSave = () => {
    // Encontrar el stageId basado en el nombre seleccionado
    const selectedStage = sortedTracking.find((stage) => stage.name === trackingStatus);

    if (!selectedStage) {
      console.error("No se encontró el stage seleccionado");
      return;
    }

    // Llamar a la API para actualizar el tracking
    updateTracking({
      newTrackingStageId: selectedStage.stageId,
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !order) {
    return (
      <Box sx={{ p: 2 }}>
        <Button
          component={Link}
          href="/admin/orders"
          startIcon={<ArrowLeft size={16} />}
          sx={{ mb: 2 }}
        >
          Volver a órdenes
        </Button>
        <Typography variant="h6" color="error">
          {isError ? "Error al cargar la orden" : "Orden no encontrada"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isError
            ? "Por favor, intenta nuevamente más tarde"
            : "Verifica el identificador de la orden en la URL"}
        </Typography>
      </Box>
    );
  }

  // Encontrar el paso actual del tracking
  const currentTrackingStage = sortedTracking.findIndex((t) => t.name === trackingStatus);
  const currentStepIndex = currentTrackingStage === -1 ? 0 : currentTrackingStage;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Breadcrumb + header */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/admin" passHref>
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ cursor: "pointer" }}
            >
              Dashboard
            </Typography>
          </Link>
          <Link href="/admin/orders" passHref>
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ cursor: "pointer" }}
            >
              Órdenes
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
              Creada el{" "}
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
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.8125rem" }}>
              Total: {formatGTQ(order.totalAmount)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ sm: 12, md: 4, lg: 3, xs: 12 }} >
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
                  bgcolor: "primary.main",
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
                  bgcolor: "primary.main",
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
                <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                  {formatGTQ(order.subtotalAmount)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Envío
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                  {formatGTQ(order.shippingCost)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Impuestos
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                  {formatGTQ(order.taxAmount)}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: "0.8125rem" }}>
                  {formatGTQ(order.totalAmount)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ sm: 12, md: 8, lg: 9 }} >
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                >
                  <Truck size={20} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Estado de envío
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel id="tracking-status-label">
                    Estado de tracking
                  </InputLabel>
                  <Select
                    labelId="tracking-status-label"
                    label="Estado de tracking"
                    value={trackingStatus}
                    onChange={handleTrackingChange}
                    disabled={isUpdating}
                  >
                    {sortedTracking.map((step) => (
                      <MenuItem key={step.stageId} value={step.name}>
                        {step.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  startIcon={<Save size={16} />}
                  onClick={handleSave}
                  disabled={isUpdating || trackingStatus === order.currentTrackingStage}
                >
                  {isUpdating ? "Guardando..." : "Guardar cambios"}
                </Button>
              </Box>
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
                    <TableCell align="center">Enlace</TableCell>
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
                        <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                          {formatGTQ(item.productDetails.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{item.quantity}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.8125rem" }}>
                          {formatGTQ(item.subtotal)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          component="a"
                          href={item.storeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          variant="outlined"
                          endIcon={<ExternalLink size={14} />}
                          sx={{
                            textTransform: "none",
                            fontSize: "0.75rem",
                          }}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Resumen */}
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <Typography variant="body2" fontWeight={600}>
                        Subtotal
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700} sx={{ fontSize: "0.8125rem" }}>
                        {formatGTQ(order.subtotalAmount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <Typography variant="body2">Envío</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                        {formatGTQ(order.shippingCost)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <Typography variant="body2">Impuestos</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                        {formatGTQ(order.taxAmount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <Typography variant="body2" fontWeight={700}>
                        Total
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700} sx={{ fontSize: "0.8125rem" }}>
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
    </Box>
  );
}
