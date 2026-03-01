"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import MuiProvider from "@/application/providers/MuiProvider";

const ConfigurationsShell = dynamic(() => import("./ConfigurationsShell"), {
  ssr: true,
});

export default function ConfigurationsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <MuiProvider>
      <ConfigurationsShell>{children}</ConfigurationsShell>
    </MuiProvider>
  );
}
