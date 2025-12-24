export interface CustomerInfo {
  id: string;
  recipientName: string;
  identificationNumber: string;
  phoneNumber: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerInfoDto {
  recipientName: string;
  identificationNumber: string;
  phoneNumber: string;
}

