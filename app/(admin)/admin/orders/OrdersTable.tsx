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
import type { SelectChangeEvent } from "@mui/material/Select";

import { Search, Filter, Eye, Download, MoreVertical } from "lucide-react";
import Link from "next/link";

export interface IOrderTable {
  id: string;
  customer: string;
  status: "pending" | "completed" | "cancelled";
  total: number;
  createdAt: string;
}

const statusConfig = {
  completed: {
    label: "Completada",
    color: "success" as const,
  },
  pending: {
    label: "Pendiente",
    color: "warning" as const,
  },
  cancelled: {
    label: "Cancelada",
    color: "error" as const,
  },
};

interface OrdersTableProps {
  initialData: IOrderTable[];
}

// Memoizar el componente de fila individual
const OrderRow = memo(function OrderRow({ order }: { order: IOrderTable }) {
  return (
    <TableRow hover>
      <TableCell>
        <Typography
          variant="body2"
          sx={{ fontFamily: "monospace", fontWeight: 600 }}
        >
          {order.id}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          {order.customer}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          size="small"
          label={statusConfig[order.status].label}
          color={statusConfig[order.status].color}
          variant="outlined"
        />
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" fontWeight={700}>
          Q{order.total.toFixed(2)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {order.createdAt}
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
            href={`/admin/orders/${order.id}`}
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

function OrdersTable({ initialData }: OrdersTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | IOrderTable["status"]
  >("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = useMemo(() => {
    return initialData
      .filter((order) => {
        const term = search.toLowerCase().trim();
        if (!term) return true;
        return (
          order.id.toLowerCase().includes(term) ||
          order.customer.toLowerCase().includes(term)
        );
      })
      .filter((order) => {
        if (statusFilter === "all") return true;
        return order.status === statusFilter;
      });
  }, [initialData, search, statusFilter]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

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
    setStatusFilter(event.target.value as "all" | IOrderTable["status"]);
    setPage(0);
  }, []);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      setPage(0);
    },
    []
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flex: 1,
            maxWidth: 700,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por # de orden o cliente"
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="status-filter-label">
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                <Filter size={14} />
                Estado
              </Box>
            </InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label={
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                  <Filter size={14} /> Estado
                </Box>
              }
              onChange={handleStatusChange}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="pending">Pendientes</MenuItem>
              <MenuItem value="completed">Completadas</MenuItem>
              <MenuItem value="cancelled">Canceladas</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filtered.length} resultado
            {filtered.length !== 1 ? "s" : ""}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download size={16} />}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader size="small" aria-label="tabla de órdenes">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Orden</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Total
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
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
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Intenta ajustar los filtros de búsqueda
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {paged.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) =>
            `Mostrando ${from}-${to} de ${
              count !== -1 ? count : `más de ${to}`
            }`
          }
        />
      </Paper>
    </Box>
  );
}

export default memo(OrdersTable);
