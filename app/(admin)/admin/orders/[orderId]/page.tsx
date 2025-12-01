"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { ArrowLeft, Save, Truck } from "lucide-react";
import { IOrder } from "../core/interfaces/order.interface";
import { mockOrders } from "../core/mock/ordersMock";


const trackingSteps: {
  key: IOrder["trackingStatus"];
  label: string;
}[] = [
  { key: "orden_recibida", label: "Orden recibida" },
  { key: "paquete_en_camino", label: "Paquete en camino" },
  { key: "paquete_recibido_empresa", label: "Paquete recibido en empresa" },
  { key: "pedido_en_ruta", label: "Pedido en ruta" },
  { key: "entregado", label: "Entregado" },
];

const paymentStatusConfig: Record<
  IOrder["paymentStatus"],
  { label: string; color: "success" | "warning" }
> = {
  paid: { label: "Pagado", color: "success" },
  pending: { label: "Pendiente", color: "warning" },
};

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();

  const order = useMemo(
    () => mockOrders.find((o) => o.orderNumber === params.orderId),
    [params.orderId]
  );

  const [trackingStatus, setTrackingStatus] = useState<
    IOrder["trackingStatus"] | undefined
  >(order?.trackingStatus);

  if (!order) {
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
        <Typography variant="h6">Orden no encontrada</Typography>
        <Typography variant="body2" color="text.secondary">
          Verifica el identificador de la orden en la URL.
        </Typography>
      </Box>
    );
  }

  const currentStepIndex =
    trackingStatus != null
      ? trackingSteps.findIndex((s) => s.key === trackingStatus)
      : 0;

  const handleTrackingChange = (event: SelectChangeEvent) => {
    setTrackingStatus(event.target.value as IOrder["trackingStatus"]);
  };

  const handleSave = () => {
    // Aquí iría tu llamada a la API para actualizar el estado
    console.log("Guardar cambios tracking:", {
      orderId: order.id,
      trackingStatus,
    });
    // Podrías mostrar un snackbar o toast aquí
  };

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
              Creada el {order.date}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Chip
              label={paymentStatusConfig[order.paymentStatus].label}
              color={paymentStatusConfig[order.paymentStatus].color}
              variant="outlined"
            />
            <Typography variant="body2" fontWeight={600}>
              Total: Q{order.total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{sm: 12, md: 4, lg: 3, xs: 12}} >
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Información del cliente
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Typography variant="body2" fontWeight={600}>
              {order.customer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.customer.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.customer.phone}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Dirección de envío
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Typography variant="body2">{order.shippingAddress.address}</Typography>
            <Typography variant="body2">
              {order.shippingAddress.city}, {order.shippingAddress.country}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.zipCode}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Método de pago:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {order.paymentMethod}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{sm: 12, md: 8, lg: 8}} >
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Truck size={18} />
                <Typography variant="subtitle1" fontWeight={600}>
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
                    value={trackingStatus ?? trackingSteps[0].key}
                    onChange={handleTrackingChange}
                  >
                    {trackingSteps.map((step) => (
                      <MenuItem key={step.key} value={step.key}>
                        {step.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  startIcon={<Save size={16} />}
                  onClick={handleSave}
                >
                  Guardar cambios
                </Button>
              </Box>
            </Box>

            <Stepper
              activeStep={
                currentStepIndex >= 0 ? currentStepIndex : 0
              }
              alternativeLabel
            >
              {trackingSteps.map((step) => (
                <Step key={step.key}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Productos */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Productos de la orden
            </Typography>
            <Divider sx={{ mb: 1.5 }} />

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
                  {order.items.map((item, index) => (
                    <TableRow
                      key={`${item.product.id}-${index}`}
                      hover
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                          {item.product.imgSrc && (
                            <Box
                              component="img"
                              src={item.product.imgSrc}
                              alt={item.product.title}
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
                              {item.product.title}
                            </Typography>
                            {item.product.brand && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.product.brand}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          Q{item.product.price.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          Q{item.subtotal.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Resumen */}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="body2" fontWeight={600}>
                        Total
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}>
                        Q{order.total.toFixed(2)}
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
