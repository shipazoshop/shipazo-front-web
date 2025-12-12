"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { adminTheme } from "@/presentation/theme/adminTheme";

const ConfigurationsShell = dynamic(() => import("./ConfigurationsShell"), {
  ssr: true,
});

export default function ConfigurationsLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <ConfigurationsShell>{children}</ConfigurationsShell>
    </ThemeProvider>
  );
}
