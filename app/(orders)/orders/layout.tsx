"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import MuiProvider from "@/application/providers/MuiProvider";

const OrdersShell = dynamic(() => import("./OrdersShell"), {
  ssr: true,
});

export default function OrdersLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <MuiProvider>
      <OrdersShell>{children}</OrdersShell>
    </MuiProvider>
  );
}
