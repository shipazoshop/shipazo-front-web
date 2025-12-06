// app/(admin)/orders/page.tsx

import { mockOrders } from "./core/mock/ordersMock";
import OrdersTable, { IOrderTable } from "./OrdersTable";

export const metadata = {
  title: "Admin | Órdenes",
};

export default function OrdersPage() {
  const orders: IOrderTable[] = mockOrders.map((order) => {
    let status: IOrderTable["status"] = "pending";

    if (order.paymentStatus === "paid") {
      status = "completed";
    }

    return {
      id: order.orderNumber,
      customer: order.customer.name,
      status,
      total: order.total,
      createdAt: order.date,
    };
  });

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

      <OrdersTable initialData={orders} />
    </div>
  );
}
