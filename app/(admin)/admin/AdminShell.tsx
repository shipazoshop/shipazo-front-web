"use client";

import { ReactNode, useState, MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu as MuiMenu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Menu as MenuIcon,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const drawerWidth = 260;

const adminMenu = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Órdenes", href: "/admin/orders", icon: ShoppingCart },
  { label: "Productos", href: "/admin/products", icon: Package },
  { label: "Usuarios", href: "/admin/users", icon: Users },
];

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header sidebar */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LayoutDashboard size={18} color="white" />
          </Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Admin Panel
          </Typography>
        </Box>
      </Box>

      {/* Menu */}
      <Box sx={{ flex: 1, p: 1 }}>
        <List>
          {adminMenu.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
            const Icon = item.icon;

            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  ...(active
                    ? {
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        boxShadow: 1,
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                        "& .MuiListItemIcon-root": {
                          color: "primary.contrastText",
                        },
                      }
                    : {
                        color: "text.secondary",
                        "&:hover": {
                          bgcolor: "action.hover",
                          color: "text.primary",
                        },
                      }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Icon size={18} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Usuario abajo */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: 1.5,
            bgcolor: "action.hover",
          }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
            <Typography variant="caption" sx={{ color: "primary.contrastText" }}>
              AD
            </Typography>
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              Admin
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
              noWrap
            >
              admin@tuapp.com
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <CssBaseline />

      {/* AppBar / Topbar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, lg: 3 } }}>
          {/* Left side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
            {!isDesktop && (
              <IconButton edge="start" onClick={handleDrawerToggle}>
                <MenuIcon size={20} />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
              Panel Administrativo
            </Typography>
          </Box>

          {/* Right side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton>
              <Badge
                variant="dot"
                overlap="circular"
                color="error"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Bell size={20} />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleOpenUserMenu}
              sx={{ ml: 0.5, borderRadius: 999, px: 0.5 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  mr: { xs: 0, md: 1 },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "primary.contrastText", fontSize: 10 }}
                >
                  AD
                </Typography>
              </Avatar>
              <Typography
                variant="body2"
                sx={{ display: { xs: "none", md: "inline" } }}
              >
                Admin
              </Typography>
            </IconButton>

            <MuiMenu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{ sx: { mt: 1, minWidth: 200 } }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2">Mi Cuenta</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleCloseUserMenu}>
                <Settings size={18} style={{ marginRight: 8 }} />
                Configuración
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleCloseUserMenu}
                sx={{ color: "error.main" }}
              >
                <LogOut size={18} style={{ marginRight: 8 }} />
                Cerrar sesión
              </MenuItem>
            </MuiMenu>
          </Box>
        </Toolbar>
      </AppBar>

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
          {drawer}
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
          {drawer}
        </Drawer>
      )}

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, lg: 4 },
          pt: { xs: 10, lg: 11 }, // espacio por el AppBar
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
