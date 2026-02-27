export interface PaymentQuota {
  ncuotas: number;
}

export interface PaymentConfiguration {
  business_uuid: string;
  payment_code: string;
  code_currency: string;
  active_quota: string; // "true" | "false" as string
  quotas: PaymentQuota[];
  amount_min_quotas: number;
}

export interface PaymentConfigurationResponse {
  success: boolean;
  message: string;
  data: PaymentConfiguration[];
}

// ── Proceso de pago ─────────────────────────────────────────────────────────

export interface CardData {
  cardNumber: string;       // Sin espacios
  expirationMonth: string;  // "MM"
  expirationYear: string;   // "YY"
  cvv: string;
  cardholderName: string;
}

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;     // Solo dígitos
  country: string;
  city: string;
  state: string;
  postalCode: string;
  address: string;
}

export interface ProcessPaymentRequest {
  orderId: string;
  paymentCode: string;
  paymentMethod: string;
  businessUuid: string;
  quotas?: number;       // Solo para cuotas
  cardData: CardData;
  customerData: CustomerData;
}

export interface ProcessPaymentResponse {
  success: boolean;
  message: string;
  data?: {
    transactionId?: string;
    status?: string;
    [key: string]: unknown;
  };
}

// ── Detalle de pago ──────────────────────────────────────────────────────────

export interface PaymentDetail {
  id: string;
  orderId: string;
  paymentMethod: string;
  paymentProvider: string;
  gatewayTransactionId: string;
  requestId: string;
  authorizationCode: string;
  amount: number;
  currency: string;
  installments: number;
  status: string;
  last4Digits: string;
  cardBrand: string;
  voucherUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetailResponse {
  success: boolean;
  data: PaymentDetail;
}
