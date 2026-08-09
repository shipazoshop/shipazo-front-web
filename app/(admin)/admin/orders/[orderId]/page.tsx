"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { ArrowLeft, Save, Truck, MapPin, CreditCard, ExternalLink, X } from "lucide-react";
import { useOrdersRepository } from "@/presentation/hooks/repositories/useOrdersRepository";
import { formatGTQ } from "@/shared/utils";

// Transportes conocidos del select. "Otro" habilita un campo de texto libre.
const CARRIER_OPTIONS = ["FedEx", "Forza", "Cargo Expreso"];

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

  const { getOrderDetail, updateOrderTracking, updateDeliveryGuide } = useOrdersRepository();
  const { data, isLoading, isError } = getOrderDetail(params.orderId);
  const order = data?.data;

  // Mutación para actualizar tracking
  const { mutate: updateTracking, isLoading: isUpdating } = updateOrderTracking(params.orderId);
  // Mutación para actualizar la guía de transporte
  const { mutate: updateGuide, isLoading: isSavingGuide } = updateDeliveryGuide(params.orderId);

  // Ordenar tracking por posición
  const sortedTracking = order ? [...order.tracking].sort((a, b) => a.position - b.position) : [];

  // Estado local para el tracking que el admin puede modificar
  const [trackingStatus, setTrackingStatus] = useState<string>("");
  const [specModal, setSpecModal] = useState<string | null>(null);

  // Estado de la guía de transporte (select + nombre custom + número)
  const [carrier, setCarrier] = useState<string>("");
  const [customCarrier, setCustomCarrier] = useState<string>("");
  const [guideNumber, setGuideNumber] = useState<string>("");

  // Sincronizar el estado local cuando se carga la orden
  if (order && !trackingStatus) {
    setTrackingStatus(order.currentTrackingStage);
  }

  // Pre-rellenar la guía existente una sola vez por orden. El formato guardado es
  // "Transporte: numero"; si el transporte no es de los conocidos, es "Otro".
  useEffect(() => {
    const dg = order?.deliveryGuide ?? "";
    const sep = dg.indexOf(": ");
    if (sep === -1) return;

    const carrierPart = dg.slice(0, sep);
    const numberPart = dg.slice(sep + 2);
    if (CARRIER_OPTIONS.includes(carrierPart)) {
      setCarrier(carrierPart);
    } else {
      setCarrier("Otro");
      setCustomCarrier(carrierPart);
    }
    setGuideNumber(numberPart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.orderId]);

  const handleTrackingChange = (event: SelectChangeEvent) => {
    setTrackingStatus(event.target.value);
  };

  // Transporte efectivo: el custom si es "Otro", si no el valor del select.
  const effectiveCarrier = carrier === "Otro" ? customCarrier.trim() : carrier;
  const trimmedGuideNumber = guideNumber.trim();
  const guideComplete = !!effectiveCarrier && !!trimmedGuideNumber;
  const composedGuide = guideComplete ? `${effectiveCarrier}: ${trimmedGuideNumber}` : "";

  // ¿Cambió cada parte respecto a lo guardado?
  const stageChanged = !!order && trackingStatus !== order.currentTrackingStage;
  const guideChanged = guideComplete && composedGuide !== (order?.deliveryGuide ?? "");
  const canSave = stageChanged || guideChanged;
  const isSaving = isUpdating || isSavingGuide;

  const handleSave = () => {
    // Actualizar tracking solo si cambió el estado.
    if (stageChanged) {
      const selectedStage = sortedTracking.find((stage) => stage.name === trackingStatus);
      if (selectedStage) {
        updateTracking({ newTrackingStageId: selectedStage.stageId });
      }
    }

    // Actualizar la guía solo si se ingresó/cambió.
    if (guideChanged) {
      updateGuide({ deliveryGuide: composedGuide });
    }
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
                    disabled={isSaving}
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
                  disabled={isSaving || !canSave}
                >
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </Box>
            </Box>

            {/* Guía de transporte */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                alignItems: "flex-start",
                mb: 3,
              }}
            >
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="carrier-label">Transporte</InputLabel>
                <Select
                  labelId="carrier-label"
                  label="Transporte"
                  value={carrier}
                  onChange={(event: SelectChangeEvent) => setCarrier(event.target.value)}
                  disabled={isSaving}
                >
                  {CARRIER_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>

              {carrier === "Otro" && (
                <TextField
                  size="small"
                  label="Nombre del transporte"
                  value={customCarrier}
                  onChange={(event) => setCustomCarrier(event.target.value)}
                  disabled={isSaving}
                  inputProps={{ maxLength: 100 }}
                  sx={{ minWidth: 200 }}
                />
              )}

              <TextField
                size="small"
                label="Número de guía"
                value={guideNumber}
                onChange={(event) => setGuideNumber(event.target.value)}
                disabled={isSaving}
                inputProps={{ maxLength: 50 }}
                helperText={`${guideNumber.length}/50`}
                sx={{ minWidth: 240 }}
              />
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
                    <TableCell sx={{ maxWidth: 220 }}>Producto</TableCell>
                    <TableCell>Especificaciones</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="center">Enlace</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => {
                    const spec = item.productDetails.productSpecification ?? "";
                    const specTooLong = spec.length > 100;
                    return (
                    <TableRow key={item.itemId} hover>
                      <TableCell sx={{ maxWidth: 220 }}>
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                          {item.productDetails.imageUrl && (
                            <Box
                              component="img"
                              src={item.productDetails.imageUrl}
                              alt={item.productDetails.name}
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                objectFit: "cover",
                                bgcolor: "grey.100",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            title={item.productDetails.name.length > 100 ? item.productDetails.name : undefined}
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              maxWidth: 160,
                            }}
                          >
                            {item.productDetails.name.length > 100
                              ? item.productDetails.name.slice(0, 100) + "..."
                              : item.productDetails.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {spec ? (
                          specTooLong ? (
                            <Button
                              size="small"
                              onClick={() => setSpecModal(spec)}
                              sx={{
                                bgcolor: "#e53935",
                                color: "#fff",
                                textTransform: "none",
                                fontSize: "0.75rem",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                "&:hover": { bgcolor: "#c62828" },
                              }}
                            >
                              Ver especificación
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {spec}
                            </Typography>
                          )
                        ) : (
                          <Typography variant="body2" color="text.disabled">—</Typography>
                        )}
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
                    );
                  })}

                  {/* Resumen */}
                  <TableRow>
                    <TableCell colSpan={5} align="right">
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
                    <TableCell colSpan={5} align="right">
                      <Typography variant="body2">Envío</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                        {formatGTQ(order.shippingCost)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      <Typography variant="body2">Impuestos</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                        {formatGTQ(order.taxAmount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} align="right">
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

      {/* Modal de especificaciones */}
      <Dialog
        open={!!specModal}
        onClose={() => setSpecModal(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pr: 1 }}>
          Especificaciones del producto
          <IconButton size="small" onClick={() => setSpecModal(null)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {specModal}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
