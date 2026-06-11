"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Package, Eye, Search, ShoppingBag, Truck, Clock } from "lucide-react";
import { useOrdersRepository } from "@/presentation/hooks/repositories/useOrdersRepository";
import { formatGTQ } from "@/shared/utils";
import type { Order } from "@/domain/entities/order.entity";

// ── Badge helpers ────────────────────────────────────────────────────────────

const PAYMENT_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  paid:    { label: "Pagado",    color: "#15803D", bg: "#DCFCE7" },
  pending: { label: "Pendiente", color: "#92400E", bg: "#FEF3C7" },
  failed:  { label: "Fallido",   color: "#991B1B", bg: "#FEE2E2" },
};

const TRACKING_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  "Orden recibida":              { label: "Orden recibida",   color: "#4A3D57", bg: "#FAF7F2" },
  "Paquete en camino":          { label: "En camino",         color: "#5B21B6", bg: "#EDE9FE" },
  "Paquete recibido en empresa":{ label: "En bodega",         color: "#1E40AF", bg: "#DBEAFE" },
  "Pedido en ruta":             { label: "En ruta",           color: "#92400E", bg: "#FEF3C7" },
  "Entregado":                  { label: "Entregado",         color: "#DC6F34", bg: "#FDF4ED" },
};

function PaymentBadge({ status }: { status: string }) {
  const cfg = PAYMENT_BADGE[status] ?? { label: status, color: "#4A3D57", bg: "#FAF7F2" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 999,
      fontSize: 12, fontWeight: 700,
      color: cfg.color, background: cfg.bg,
    }}>
      {cfg.label}
    </span>
  );
}

function TrackingBadge({ stage }: { stage: string }) {
  const cfg = TRACKING_BADGE[stage] ?? { label: stage, color: "#4A3D57", bg: "#FAF7F2" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 999,
      fontSize: 12, fontWeight: 700,
      color: cfg.color, background: cfg.bg,
    }}>
      {cfg.label}
    </span>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, accent }: {
  icon: React.ReactNode; label: string; value: number | string; accent: string;
}) {
  return (
    <Box sx={{
      flex: 1, minWidth: 0,
      bgcolor: "white", borderRadius: "16px",
      border: "1px solid #ECE5DC",
      p: "20px 24px",
      display: "flex", alignItems: "center", gap: 2,
    }}>
      <Box sx={{
        width: 44, height: 44, borderRadius: "12px",
        display: "flex", alignItems: "center", justifyContent: "center",
        bgcolor: accent === "orange" ? "#FDF4ED" : "#F3EEFF",
        color: accent === "orange" ? "#DC6F34" : "#562B7F",
        flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A7D96" }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#1A0D24", lineHeight: 1.1, fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif" }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

// ── Filter tabs ──────────────────────────────────────────────────────────────

const TABS = [
  { key: "all",      label: "Todas" },
  { key: "paid",     label: "Pagadas" },
  { key: "pending",  label: "Pendientes" },
  { key: "camino",   label: "En camino" },
] as const;

type TabKey = typeof TABS[number]["key"];

function filterOrders(orders: Order[], tab: TabKey, search: string): Order[] {
  let result = orders;
  if (tab === "paid")    result = result.filter((o) => o.paymentStatus === "paid");
  if (tab === "pending") result = result.filter((o) => o.paymentStatus !== "paid");
  if (tab === "camino")  result = result.filter((o) => o.currentTrackingStageName === "Paquete en camino");
  if (search.trim())     result = result.filter((o) => o.correlative.toLowerCase().includes(search.toLowerCase()));
  return result;
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");

  const { getOrders } = useOrdersRepository();
  const { data, isLoading, isError } = getOrders(true, { page, limit: 20 });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  const totalOrders = meta?.totalItems ?? 0;
  const enCamino = orders.filter((o) => o.currentTrackingStageName === "Paquete en camino").length;
  const pendientes = orders.filter((o) => o.paymentStatus !== "paid").length;

  const filtered = useMemo(() => filterOrders(orders, activeTab, search), [orders, activeTab, search]);

  const startItem = meta ? (meta.currentPage - 1) * meta.limit + 1 : 0;
  const endItem   = meta ? Math.min(meta.currentPage * meta.limit, meta.totalItems) : 0;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#DC6F34" }} />
      </Box>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 10 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#1A0D24" }}>Error al cargar las órdenes</Typography>
        <Typography sx={{ color: "#8A7D96", fontSize: 14 }}>Por favor, intenta nuevamente más tarde</Typography>
      </Box>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────
  const emptyState = (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 8 }}>
      <Box sx={{
        width: 64, height: 64, borderRadius: "18px",
        display: "flex", alignItems: "center", justifyContent: "center",
        bgcolor: "#FDF4ED", color: "#DC6F34",
      }}>
        <Package size={28} />
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#1A0D24" }}>No tienes órdenes aún</Typography>
      <Typography sx={{ color: "#8A7D96", fontSize: 14 }}>¡Pega el link de un producto y empieza a comprar!</Typography>
      <Button
        component={Link} href="/home"
        variant="contained"
        sx={{
          mt: 1, textTransform: "none", fontWeight: 700, borderRadius: "12px",
          bgcolor: "#DC6F34", "&:hover": { bgcolor: "#c4612e" },
          boxShadow: "0 8px 20px -8px rgba(220,111,52,0.5)",
        }}
      >
        Ir a la Tienda
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

      {/* ── Page title ────────────────────────────────────────────────────── */}
      <Box>
        <Typography sx={{
          fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif",
          fontWeight: 900, fontSize: { xs: 22, sm: 28 }, color: "#1A0D24", lineHeight: 1,
        }}>
          Mis Órdenes
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 14, color: "#8A7D96" }}>
          Consulta el estado de todas tus compras
        </Typography>
      </Box>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <StatCard icon={<ShoppingBag size={20} />} label="Total órdenes" value={totalOrders} accent="orange" />
        <StatCard icon={<Truck size={20} />}        label="En camino"     value={enCamino}    accent="purple" />
        <StatCard icon={<Clock size={20} />}        label="Pendientes"    value={pendientes}  accent="purple" />
      </Box>

      {/* ── Filter row ────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        {/* Tabs */}
        <Box sx={{
          display: "flex", gap: 0.5, p: "5px",
          bgcolor: "#F4EFE9", borderRadius: "14px",
          flexShrink: 0,
        }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "7px 16px", borderRadius: "10px", border: "none",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                background: activeTab === t.key ? "white" : "transparent",
                color: activeTab === t.key ? "#1A0D24" : "#8A7D96",
                boxShadow: activeTab === t.key ? "0 2px 8px -2px rgba(26,13,36,0.12)" : "none",
                transition: "all 0.18s",
              }}
            >
              {t.label}
            </button>
          ))}
        </Box>

        {/* Search */}
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por número de orden…"
          size="small"
          sx={{
            ml: "auto", minWidth: 220,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px", bgcolor: "white", fontSize: 13,
              "& fieldset": { borderColor: "#ECE5DC" },
              "&:hover fieldset": { borderColor: "#DC6F34" },
              "&.Mui-focused fieldset": { borderColor: "#DC6F34", borderWidth: 1.5 },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={15} color="#8A7D96" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* ── Desktop table ─────────────────────────────────────────────────── */}
      <Box sx={{ display: { xs: "none", sm: "block" }, bgcolor: "white", borderRadius: "18px", border: "1px solid #ECE5DC", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#FAF7F2" }}>
                {["Número de Orden", "Fecha", "Total", "Productos", "Pago", "Envío", ""].map((h) => (
                  <TableCell key={h} sx={{ py: 1.5, borderBottom: "1px solid #ECE5DC" }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8A7D96" }}>
                      {h}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ border: 0 }}>
                    {emptyState}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order, idx) => (
                  <TableRow
                    key={order.id}
                    sx={{
                      "&:last-child td": { border: 0 },
                      "& td": { borderBottom: "1px solid #F4EFE9" },
                      "&:hover": { bgcolor: "#FAF7F2" },
                      transition: "background 0.15s",
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1A0D24", fontFamily: "'JetBrains Mono', monospace" }}>
                        {order.correlative}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography sx={{ fontSize: 13, color: "#8A7D96" }}>
                        {new Date(order.createdAt).toLocaleDateString("es-GT", { year: "numeric", month: "short", day: "numeric" })}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#DC6F34" }}>
                        {formatGTQ(order.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography sx={{ fontSize: 13, color: "#8A7D96" }}>
                        {order.itemsCount} {order.itemsCount === 1 ? "producto" : "productos"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <PaymentBadge status={order.paymentStatus} />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <TrackingBadge stage={order.currentTrackingStageName} />
                    </TableCell>
                    <TableCell sx={{ py: 2 }} align="right">
                      <Button
                        component={Link}
                        href={`/orders/${order.correlative}`}
                        size="small"
                        startIcon={<Eye size={13} />}
                        sx={{
                          textTransform: "none", fontWeight: 700, fontSize: 12,
                          borderRadius: "10px", px: 1.75, py: 0.75,
                          border: "1px solid #ECE5DC", color: "#1A0D24", bgcolor: "white",
                          "&:hover": { borderColor: "#DC6F34", color: "#DC6F34", bgcolor: "#FDF4ED" },
                          transition: "all 0.18s",
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
      </Box>

      {/* ── Mobile cards ──────────────────────────────────────────────────── */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "column", gap: 1.5 }}>
        {filtered.length === 0 ? emptyState : filtered.map((order) => (
          <Box
            key={order.id}
            sx={{
              bgcolor: "white", borderRadius: "16px",
              border: "1px solid #ECE5DC", overflow: "hidden",
            }}
          >
            {/* Card header */}
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8A7D96" }}>
                  Orden
                </Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1A0D24", fontFamily: "'JetBrains Mono', monospace" }}>
                  {order.correlative}
                </Typography>
              </Box>
              <TrackingBadge stage={order.currentTrackingStageName} />
            </Box>

            <Box sx={{ height: "1px", bgcolor: "#F4EFE9", mx: 2.5 }} />

            {/* Fecha + total */}
            <Box sx={{ px: 2.5, py: 1.5, display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8A7D96" }}>Fecha</Typography>
                <Typography sx={{ fontSize: 13, color: "#1A0D24", fontWeight: 500 }}>
                  {new Date(order.createdAt).toLocaleDateString("es-GT", { year: "numeric", month: "short", day: "numeric" })}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8A7D96" }}>Total</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#DC6F34" }}>
                  {formatGTQ(order.totalAmount)}
                </Typography>
              </Box>
            </Box>

            {/* Productos + pago */}
            <Box sx={{ px: 2.5, pb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontSize: 12, color: "#8A7D96" }}>
                {order.itemsCount} {order.itemsCount === 1 ? "producto" : "productos"}
              </Typography>
              <PaymentBadge status={order.paymentStatus} />
            </Box>

            <Box sx={{ height: "1px", bgcolor: "#F4EFE9" }} />

            {/* CTA */}
            <Box sx={{ p: 2 }}>
              <Button
                component={Link}
                href={`/orders/${order.correlative}`}
                fullWidth
                startIcon={<Eye size={15} />}
                sx={{
                  textTransform: "none", fontWeight: 700, fontSize: 13,
                  borderRadius: "12px", py: 1.25,
                  border: "1px solid #ECE5DC", color: "#1A0D24", bgcolor: "white",
                  "&:hover": { borderColor: "#DC6F34", color: "#DC6F34", bgcolor: "#FDF4ED" },
                }}
              >
                Ver Detalles
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {meta && orders.length > 0 && (
        <Box sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 1.5,
          bgcolor: "white", borderRadius: "14px", border: "1px solid #ECE5DC",
          px: 2.5, py: 1.75,
        }}>
          <Typography sx={{ fontSize: 13, color: "#8A7D96" }}>
            Mostrando <strong style={{ color: "#1A0D24" }}>{startItem}–{endItem}</strong> de{" "}
            <strong style={{ color: "#1A0D24" }}>{meta.totalItems}</strong> órdenes
          </Typography>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              disabled={!meta.hasPreviousPage}
              onClick={() => setPage((p) => p - 1)}
              size="small"
              sx={{
                textTransform: "none", fontWeight: 700, fontSize: 13,
                borderRadius: "10px", px: 2, py: 0.75, minWidth: 0,
                border: "1px solid #ECE5DC", color: "#1A0D24", bgcolor: "white",
                "&:hover": { borderColor: "#DC6F34", color: "#DC6F34", bgcolor: "#FDF4ED" },
                "&:disabled": { borderColor: "#ECE5DC", color: "#C4B8D0", bgcolor: "white" },
              }}
            >
              ← Anterior
            </Button>

            {/* Page numbers */}
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === meta.totalPages || Math.abs(p - meta.currentPage) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <Typography key={`ellipsis-${i}`} sx={{ fontSize: 13, color: "#8A7D96", px: 0.5 }}>…</Typography>
                ) : (
                  <Button
                    key={p}
                    onClick={() => setPage(p as number)}
                    size="small"
                    sx={{
                      minWidth: 36, height: 36, borderRadius: "10px",
                      fontWeight: 700, fontSize: 13,
                      border: "1px solid",
                      borderColor: meta.currentPage === p ? "#DC6F34" : "#ECE5DC",
                      color: meta.currentPage === p ? "#DC6F34" : "#1A0D24",
                      bgcolor: meta.currentPage === p ? "#FDF4ED" : "white",
                      "&:hover": { borderColor: "#DC6F34", color: "#DC6F34", bgcolor: "#FDF4ED" },
                    }}
                  >
                    {p}
                  </Button>
                )
              )}

            <Button
              disabled={!meta.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              size="small"
              sx={{
                textTransform: "none", fontWeight: 700, fontSize: 13,
                borderRadius: "10px", px: 2, py: 0.75, minWidth: 0,
                border: "1px solid #ECE5DC", color: "#1A0D24", bgcolor: "white",
                "&:hover": { borderColor: "#DC6F34", color: "#DC6F34", bgcolor: "#FDF4ED" },
                "&:disabled": { borderColor: "#ECE5DC", color: "#C4B8D0", bgcolor: "white" },
              }}
            >
              Siguiente →
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
