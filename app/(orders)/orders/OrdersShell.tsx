"use client";

import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import { useOrdersShell } from "@/presentation/hooks/orders/useOrdersShell";
import { Sidebar } from "@/presentation/components/orders/Sidebar";

const drawerWidth = 260;

interface OrdersShellProps {
  children: ReactNode;
}

export default function OrdersShell({ children }: OrdersShellProps) {
  const {
    isDesktop,
    mobileOpen,
    activeMenuItems,
    handleDrawerToggle,
  } = useOrdersShell();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar - Desktop + Mobile */}
      {isDesktop ? (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: 1,
              borderColor: "divider",
            },
          }}
        >
          <Sidebar menuItems={activeMenuItems} />
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Sidebar menuItems={activeMenuItems} />
        </Drawer>
      )}

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, lg: 4 },
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
