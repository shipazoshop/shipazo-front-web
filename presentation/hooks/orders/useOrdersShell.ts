"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Package, History } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
}

export const useOrdersShell = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1200);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => {
      window.removeEventListener("resize", checkIsDesktop);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems: MenuItem[] = [
    {
      label: "Todas las órdenes",
      href: "/orders",
      icon: Package,
      active: pathname === "/orders",
    },
    {
      label: "Historial",
      href: "/orders/history",
      icon: History,
      active: pathname === "/orders/history",
    },
  ];

  return {
    isDesktop,
    mobileOpen,
    activeMenuItems: menuItems,
    handleDrawerToggle,
  };
};
