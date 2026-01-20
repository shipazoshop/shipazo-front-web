"use client";

import { useMemo, useState, useCallback, memo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import type { SelectChangeEvent } from "@mui/material/Select";

import { Search, Filter, Eye, Download, MoreVertical, Calendar } from "lucide-react";
import Link from "next/link";
import { useOrdersRepository } from "@/presentation/hooks/repositories/useOrdersRepository";
import type { Order } from "@/domain/entities/order.entity";
import { formatGTQ } from "@/shared/utils";

const paymentStatusConfig = {
  paid: {
    label: "Pagado",
    color: "success" as const,
  },
  pending: {
    label: "Pendiente",
    color: "warning" as const,
  },
  failed: {
    label: "Fallido",
    color: "error" as const,
  },
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

// Memoizar el componente de fila individual
const OrderRow = memo(function OrderRow({ order }: { order: Order }) {
  return (
    <TableRow hover>
      <TableCell>
        <Typography
          variant="body2"
          sx={{ fontFamily: "monospace", fontWeight: 600 }}
        >
          {order.correlative}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          size="small"
          label={order.currentTrackingStageName}
          color={
            trackingStatusColors[order.currentTrackingStageName.toLowerCase()] ||
            "default"
          }
        />
      </TableCell>
      <TableCell>
        <Chip
          size="small"
          label={
            paymentStatusConfig[
              order.paymentStatus as keyof typeof paymentStatusConfig
            ]?.label || order.paymentStatus
          }
          color={
            paymentStatusConfig[
              order.paymentStatus as keyof typeof paymentStatusConfig
            ]?.color || "info"
          }
          variant="outlined"
        />
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" fontWeight={700}>
          {formatGTQ(order.totalAmount)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {new Date(order.createdAt).toLocaleDateString("es-GT", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {order.itemsCount} {order.itemsCount === 1 ? "producto" : "productos"}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<Eye size={16} />}
            component={Link}
            href={`/admin/orders/${order.correlative}`}
          >
            Ver
          </Button>
          <IconButton size="small">
            <MoreVertical size={18} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
});

function OrdersTable() {
  // Filtros locales
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Construir parámetros para el API
  const apiParams = useMemo(() => {
    const params: any = {
      page: page + 1, // API usa paginación base 1
      limit: rowsPerPage,
    };

    if (searchTerm.trim()) {
      params.orderNumber = searchTerm.trim();
    }

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    if (paymentStatusFilter !== "all") {
      params.paymentStatus = paymentStatusFilter;
    }

    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }

    return params;
  }, [searchTerm, statusFilter, paymentStatusFilter, startDate, endDate, page, rowsPerPage]);

  // Obtener datos del repositorio
  const { getOrders } = useOrdersRepository();
  const { data, isLoading, isError } = getOrders(true, apiParams);

  const orders = data?.data || [];
  const totalItems = data?.meta?.totalItems || 0;

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    },
    []
  );

  const handleStatusChange = useCallback((event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  }, []);

  const handlePaymentStatusChange = useCallback((event: SelectChangeEvent) => {
    setPaymentStatusFilter(event.target.value);
    setPage(0);
  }, []);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setPage(0);
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setPage(0);
  }, []);

  if (isError) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error al cargar las órdenes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Por favor, intenta nuevamente más tarde
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Filtros */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Primera fila de filtros */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { md: "center" },
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por # de orden"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: { md: 350 } }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="status-filter-label">
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                <Filter size={14} />
                Estado de Envío
              </Box>
            </InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label={
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                  <Filter size={14} /> Estado de Envío
                </Box>
              }
              onChange={handleStatusChange}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="Orden recibida">Orden Recibida</MenuItem>
              <MenuItem value="Paquete en camino">Paquete en camino</MenuItem>
              <MenuItem value="Paquete recibido en empresa">
                Paquete recibido en empresa
              </MenuItem>
              <MenuItem value="Pedido en ruta">Pedido en ruta</MenuItem>
              <MenuItem value="entregado">Entregado</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="payment-status-filter-label">Estado de Pago</InputLabel>
            <Select
              labelId="payment-status-filter-label"
              value={paymentStatusFilter}
              label="Estado de Pago"
              onChange={handlePaymentStatusChange}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="paid">Pagado</MenuItem>
              <MenuItem value="failed">Fallido</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Segunda fila - filtros de fecha */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { sm: "center" },
          }}
        >
          <TextField
            size="small"
            type="date"
            label="Fecha Inicio"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(0);
            }}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Calendar size={16} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 200 }}
          />

          <TextField
            size="small"
            type="date"
            label="Fecha Fin"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(0);
            }}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Calendar size={16} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 200 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: "auto" }}>
            {(searchTerm || statusFilter !== "all" || paymentStatusFilter !== "all" || startDate || endDate) && (
              <Button
                size="small"
                variant="text"
                onClick={handleClearFilters}
              >
                Limpiar filtros
              </Button>
            )}

            <Typography variant="body2" color="text.secondary">
              {totalItems} resultado{totalItems !== 1 ? "s" : ""}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Download size={16} />}
              disabled
            >
              Exportar
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tabla */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small" aria-label="tabla de órdenes">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Orden</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado Envío</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado Pago</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Total
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Productos</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <Search size={28} style={{ opacity: 0.4 }} />
                      <Typography variant="subtitle2">
                        No se encontraron órdenes
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Intenta ajustar los filtros de búsqueda
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) =>
            `Mostrando ${from}-${to} de ${count !== -1 ? count : `más de ${to}`
            }`
          }
        />
      </Paper>
    </Box>
  );
}

export default memo(OrdersTable);
