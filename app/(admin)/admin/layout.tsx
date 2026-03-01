"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import MuiProvider from "@/application/providers/MuiProvider";
import { AdminShellSkeleton } from "@/presentation/components/admin/AdminShellSkeleton";

const AdminShell = dynamic(() => import("./AdminShell"), {
  loading: () => <AdminShellSkeleton />,
  ssr: true,
});

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <MuiProvider>
      <AdminShell>{children}</AdminShell>
    </MuiProvider>
  );
}
