"use client";

import dynamic from "next/dynamic";
import { OrdersTableSkeleton } from "@/presentation/components/admin/OrdersTableSkeleton";

const OrdersTable = dynamic(() => import("./OrdersTable"), {
  loading: () => <OrdersTableSkeleton />,
  ssr: false,
});

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Órdenes
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Administra y filtra todas las órdenes de tu tienda.
        </p>
      </div>

      <OrdersTable />
    </div>
  );
}
