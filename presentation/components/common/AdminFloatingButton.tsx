"use client";

import { memo } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Settings, ArrowRight } from "lucide-react";
import { useIsAdmin } from "@/presentation/hooks/useIsAdmin";
import { alpha } from "@mui/material/styles";

export const AdminFloatingButton = memo(function AdminFloatingButton() {
  const { isAdmin, isLoading } = useIsAdmin();

  // No mostrar si no es admin o está cargando
  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        animation: "slideInRight 0.5s ease-out",
        "@keyframes slideInRight": {
          from: {
            transform: "translateX(100%)",
            opacity: 0,
          },
          to: {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
      }}
    >
      <Paper
        elevation={8}
        sx={{
          background: "linear-gradient(135deg, #ff3d3d 0%, #ff6b6b 100%)",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "150px",
            height: "150px",
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            transform: "translate(30%, -30%)",
          },
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            position: "relative",
            zIndex: 1,
            minWidth: 280,
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Settings size={20} color="white" />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                Panel de Administración
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.75rem",
                }}
              >
                Tienes acceso completo
              </Typography>
            </Box>
          </Box>

          {/* Button */}
          <Button
            component={Link}
            href="/admin"
            variant="contained"
            endIcon={<ArrowRight size={18} />}
            sx={{
              bgcolor: "white",
              color: "#ff3d3d",
              fontWeight: 700,
              py: 1.25,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.95)",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Ir al Panel Admin
          </Button>

          {/* Decorative dot */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#4caf50",
              boxShadow: "0 0 0 4px rgba(76, 175, 80, 0.3)",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%, 100%": {
                  opacity: 1,
                },
                "50%": {
                  opacity: 0.5,
                },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
});
