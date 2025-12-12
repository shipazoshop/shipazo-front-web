import type { IOrder } from "@/app/(admin)/admin/orders/core/interfaces/order.interface";
import { mockProducts } from "./products.mock";

export const mockOrders: IOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    date: "2025-11-10",
    customer: {
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      phone: "+502 5555 0001",
    },
    items: [
      {
        product: mockProducts[0],
        quantity: 1,
        subtotal: 120.5,
      },
    ],
    total: 120.5,
    paymentMethod: "Tarjeta de crédito",
    paymentStatus: "pending",
    trackingStatus: "orden_recibida",
    shippingAddress: {
      address: "1a Calle 10-20 Zona 1",
      city: "Quetzaltenango",
      country: "Guatemala",
      zipCode: "09001",
    },
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    date: "2025-11-11",
    customer: {
      name: "María García",
      email: "maria.garcia@example.com",
      phone: "+502 5555 0002",
    },
    items: [
      {
        product: mockProducts[2],
        quantity: 1,
        subtotal: 89.99,
      },
    ],
    total: 89.99,
    paymentMethod: "Pago contra entrega",
    paymentStatus: "paid",
    trackingStatus: "entregado",
    shippingAddress: {
      address: "3a Avenida 5-30 Zona 3",
      city: "Guatemala",
      country: "Guatemala",
      zipCode: "01001",
    },
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    date: "2025-11-12",
    customer: {
      name: "Carlos López",
      email: "carlos.lopez@example.com",
      phone: "+502 5555 0003",
    },
    items: [
      {
        product: mockProducts[1],
        quantity: 1,
        subtotal: 245.0,
      },
    ],
    total: 245.0,
    paymentMethod: "Tarjeta de débito",
    paymentStatus: "paid",
    trackingStatus: "paquete_en_camino",
    shippingAddress: {
      address: "4a Calle 2-10 Zona 8",
      city: "Mixco",
      country: "Guatemala",
      zipCode: "01057",
    },
  },
  {
    id: "4",
    orderNumber: "ORD-004",
    date: "2025-11-12",
    customer: {
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      phone: "+502 5555 0004",
    },
    items: [
      {
        product: mockProducts[0],
        quantity: 1,
        subtotal: 120.5,
      },
    ],
    total: 120.5,
    paymentMethod: "Tarjeta de crédito",
    paymentStatus: "pending",
    trackingStatus: "orden_recibida",
    shippingAddress: {
      address: "Boulevard Principal 15-60",
      city: "Antigua Guatemala",
      country: "Guatemala",
      zipCode: "03001",
    },
  },
  {
    id: "5",
    orderNumber: "ORD-005",
    date: "2025-11-13",
    customer: {
      name: "Luis Rodríguez",
      email: "luis.rodriguez@example.com",
      phone: "+502 5555 0005",
    },
    items: [
      {
        product: mockProducts[1],
        quantity: 1,
        subtotal: 189.99,
      },
    ],
    total: 189.99,
    paymentMethod: "Tarjeta de crédito",
    paymentStatus: "pending",
    trackingStatus: "paquete_recibido_empresa",
    shippingAddress: {
      address: "Calzada Roosevelt 30-10",
      city: "Guatemala",
      country: "Guatemala",
      zipCode: "01011",
    },
  },
  {
    id: "6",
    orderNumber: "ORD-006",
    date: "2025-11-14",
    customer: {
      name: "Sofía Hernández",
      email: "sofia.hernandez@example.com",
      phone: "+502 5555 0006",
    },
    items: [
      {
        product: mockProducts[2],
        quantity: 2,
        subtotal: 179.98,
      },
      {
        product: mockProducts[0],
        quantity: 1,
        subtotal: 120.5,
      },
    ],
    total: 300.48,
    paymentMethod: "Transferencia bancaria",
    paymentStatus: "paid",
    trackingStatus: "pedido_en_ruta",
    shippingAddress: {
      address: "5a Avenida 12-45 Zona 10",
      city: "Guatemala",
      country: "Guatemala",
      zipCode: "01010",
    },
  },
];
