export interface ICartProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  brand?: string;
  stock: boolean;
  weight?: string;
  dimensions?: string;
  images: string[];
  imgSrc: string;
  imgHover?: string;
  quantity: number;
  priceDetails?: {
    basePriceUsd: string;
    exchangeRate: string;
    basePriceGtq: string;
    taxes: { dutyRate: string };
    operationalCosts: {
      flete: string;
      dai: string;
      iva: string;
      servicioCalshop: string;
      comisionParcela: string;
      valorCif: string;
    };
    finalPrice: string;
  };
}

export interface OrderItem {
  product: ICartProduct;
  quantity: number;
  subtotal: number;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  paymentStatus: "paid" | "pending";
  trackingStatus:
    | "orden_recibida"
    | "paquete_en_camino"
    | "paquete_recibido_empresa"
    | "pedido_en_ruta"
    | "entregado";
  shippingAddress: {
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
}
