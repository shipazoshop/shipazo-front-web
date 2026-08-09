export interface CustomerInfo {
  id: string;
  recipientName: string;
  identificationNumber: string;
  email: string;
  phoneNumber: string;
  nit?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerInfoDto {
  recipientName: string;
  identificationNumber: string;
  phoneNumber: string;
  nit?: string; // NIT predeterminado del cliente (opcional)
}

// Respuesta del endpoint GET /customers/nit/{nit}.
// Nota: la API responde 200 tanto para NIT válido como inválido; el campo
// `success` es el que determina la validez (no el status HTTP).
export interface ValidateNitResponse {
  success: boolean;
  message: string;
  nit: string;
  razonSocial: string | null;
}

