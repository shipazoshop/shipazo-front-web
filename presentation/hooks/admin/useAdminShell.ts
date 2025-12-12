import { useState, useCallback, useMemo, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingCart,
} from "lucide-react";

export const adminMenu = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Órdenes", href: "/admin/orders", icon: ShoppingCart },
  { label: "Rendimiento", href: "/admin/analytics", icon: ChartNoAxesCombined },
  // { label: "Usuarios", href: "/admin/users", icon: Users },
];

export function useAdminShell() {
  const pathname = usePathname();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleOpenUserMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const activeMenuItems = useMemo(
    () =>
      adminMenu.map((item) => ({
        ...item,
        active:
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href + "/")),
      })),
    [pathname]
  );

  return {
    pathname,
    theme,
    isDesktop,
    mobileOpen,
    anchorElUser,
    activeMenuItems,
    handleDrawerToggle,
    handleOpenUserMenu,
    handleCloseUserMenu,
  };
}
