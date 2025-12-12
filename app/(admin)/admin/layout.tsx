"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { adminTheme } from "@/presentation/theme/adminTheme";
import { AdminShellSkeleton } from "@/presentation/components/admin/AdminShellSkeleton";

const AdminShell = dynamic(() => import("./AdminShell"), {
  loading: () => <AdminShellSkeleton />,
  ssr: true,
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <AdminShell>{children}</AdminShell>
    </ThemeProvider>
  );
}
