"use client";

import { memo } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

export const Sidebar = memo(function Sidebar({ menuItems }: SidebarProps) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "white",
      }}
    >
      {/* Header — gradiente naranja */}
      <Box
        sx={{
          m: 2,
          mb: 1,
          borderRadius: "18px",
          p: "22px 22px 20px",
          background: "linear-gradient(135deg, #DC6F34 0%, #F4A261 100%)",
          boxShadow: "0 12px 28px -10px rgba(220,111,52,0.45)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            right: "-30px",
            top: "-30px",
            width: "140px",
            height: "140px",
            background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif",
            fontWeight: 900,
            fontSize: "22px",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            color: "white",
            position: "relative",
            zIndex: 1,
          }}
        >
          Shipazo
        </Typography>
        <Typography
          sx={{
            mt: "6px",
            fontSize: "10.5px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
            position: "relative",
            zIndex: 1,
          }}
        >
          Mis órdenes
        </Typography>
      </Box>

      {/* Nav items */}
      <List sx={{ px: 2, py: 1, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              sx={{
                borderRadius: "12px",
                py: 1.5,
                px: 1.75,
                transition: "all 0.2s ease",
                gap: 1.5,
                ...(item.active
                  ? {
                      bgcolor: "#1A0D24",
                      color: "white",
                      boxShadow: "0 8px 18px -8px rgba(26,13,36,0.4)",
                      "&:hover": { bgcolor: "#2a1340" },
                    }
                  : {
                      color: "#4A3D57",
                      "&:hover": { bgcolor: "#FAF7F2", color: "#1A0D24" },
                    }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  width: 32,
                  height: 32,
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  bgcolor: item.active ? "#DC6F34" : "#FAF7F2",
                  color: item.active ? "white" : "#8A7D96",
                  transition: "all 0.2s",
                }}
              >
                <item.icon size={16} strokeWidth={2} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    fontWeight: item.active ? 700 : 600,
                    fontSize: "0.9rem",
                    color: "inherit",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          pt: 2,
          borderTop: "1px solid #ECE5DC",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Button
          component={Link}
          href="/home"
          variant="outlined"
          fullWidth
          startIcon={<ArrowLeft size={14} />}
          sx={{
            borderColor: "#ECE5DC",
            color: "#1A0D24",
            fontWeight: 700,
            fontSize: "13px",
            textTransform: "none",
            py: 1.25,
            borderRadius: "12px",
            "&:hover": {
              borderColor: "#DC6F34",
              color: "#DC6F34",
              bgcolor: "#FDF4ED",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s",
          }}
        >
          Volver a la Tienda
        </Button>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            fontWeight: 600,
            color: "#8A7D96",
            fontSize: "11px",
          }}
        >
          Shipazo v1.0
        </Typography>
      </Box>
    </Box>
  );
});
