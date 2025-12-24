"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { adminTheme } from "@/presentation/theme/adminTheme";

const OrdersShell = dynamic(() => import("./OrdersShell"), {
  ssr: true,
});

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <OrdersShell>{children}</OrdersShell>
    </ThemeProvider>
  );
}
