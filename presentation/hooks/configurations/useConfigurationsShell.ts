import { useState, useCallback, useMemo, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MapPin, User } from "lucide-react";

export const configurationsMenu = [
  { label: "Mis Direcciones", href: "/configurations/address", icon: MapPin },
  { label: "Mi Información Personal", href: "/configurations/personal-info", icon: User },
];

export function useConfigurationsShell() {
  const pathname = usePathname();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const activeMenuItems = useMemo(
    () =>
      configurationsMenu.map((item) => ({
        ...item,
        active:
          pathname === item.href ||
          (item.href !== "/configurations" && pathname.startsWith(item.href + "/")),
      })),
    [pathname]
  );

  return {
    pathname,
    theme,
    isDesktop,
    mobileOpen,
    activeMenuItems,
    handleDrawerToggle,
  };
}
