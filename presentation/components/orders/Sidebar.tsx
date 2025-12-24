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
import Toolbar from "@mui/material/Toolbar";
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
        background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
      }}
    >
      {/* Logo Area */}
      <Toolbar
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          py: 2.5,
          background: "linear-gradient(135deg, #4a90e2 0%, #5ba3f5 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at top right, rgba(255, 255, 255, 0.2) 0%, transparent 60%)",
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, width: "100%" }}>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              color: "white",
              letterSpacing: "-0.5px",
              textShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            Shipazo
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: 600,
              fontSize: "0.7rem",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Mis Órdenes
          </Typography>
        </Box>
      </Toolbar>

      {/* Menu Items */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              sx={{
                borderRadius: 2,
                py: 1.5,
                transition: "all 0.2s ease-in-out",
                position: "relative",
                overflow: "hidden",
                ...(item.active
                  ? {
                      bgcolor: "#4a90e2",
                      color: "white",
                      boxShadow: "0px 4px 12px rgba(74, 144, 226, 0.25)",
                      "&:hover": {
                        bgcolor: "#3a7bc8",
                        transform: "translateX(4px)",
                        boxShadow: "0px 6px 16px rgba(74, 144, 226, 0.35)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        bgcolor: "white",
                        borderRadius: "0 4px 4px 0",
                      },
                    }
                  : {
                      color: "text.primary",
                      "&:hover": {
                        bgcolor: "action.hover",
                        transform: "translateX(4px)",
                      },
                    }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: item.active ? "white" : "#4a90e2",
                }}
              >
                <item.icon size={22} strokeWidth={2.5} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    fontWeight: item.active ? 700 : 600,
                    fontSize: "0.95rem",
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
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <Button
          component={Link}
          href="/home"
          variant="outlined"
          fullWidth
          startIcon={<ArrowLeft size={16} />}
          sx={{
            mb: 2,
            borderColor: "#4a90e2",
            color: "#4a90e2",
            fontWeight: 600,
            textTransform: "none",
            py: 1,
            "&:hover": {
              borderColor: "#3a7bc8",
              bgcolor: "rgba(74, 144, 226, 0.04)",
            },
          }}
        >
          Volver a la Tienda
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          Shipazo v1.0
        </Typography>
      </Box>
    </Box>
  );
});
