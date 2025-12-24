// Entidades para Órdenes

export interface ProductDetails {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  additionalInfo?: Record<string, any>;
}

export interface OrderProduct {
  storeLink: string;
  productDetails: ProductDetails;
  quantity: number;
}

export interface CreateOrderDto {
  products: OrderProduct[];
  shippingAddressId: string;
  paymentMethod: string;
}

export interface OrderItem {
  itemId: string;
  storeLink: string;
  productDetails: ProductDetails;
  quantity: number;
  subtotal: number;
}

export interface TrackingStage {
  stageId: string;
  name: string;
  status: string;
  position: number;
  updatedAt: string;
  updatedBy: string;
  notes?: string;
}

export interface ShippingAddress {
  addressId: string;
  fullAddress: string;
  postalCode: string;
}

export interface OrderDetail {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  userId: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  currentTrackingStage: string;
  tracking: TrackingStage[];
  items: OrderItem[];
  subtotalAmount: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddress: ShippingAddress;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: OrderDetail;
}

export interface Order {
  id: string;
  correlative: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  currentTrackingStageName: string;
  createdAt: string;
  updatedAt: string;
  itemsCount: number;
}

export interface OrdersListMeta {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface OrdersListResponse {
  success: boolean;
  message: string;
  data: Order[];
  meta: OrdersListMeta;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  orderNumber?: string;
  paymentStatus?: string;
}
