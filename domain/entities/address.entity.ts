export interface Address {
  id: string;
  address: string;
  postalCode: string;
  additionalSpecifications?: string;
  city: string;
  stateProvince: string;
  countryCode: string;
  alias: string;
  isDefault: boolean;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressDto {
  address: string;
  postalCode: string;
  additionalSpecifications?: string;
  city: string;
  stateProvince: string;
  countryCode: string;
  alias: string;
  isDefault: boolean;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {
  id: string;
}

export interface UpdateAddressResponse {
  success: boolean;
  message: string;
  address: Address;
}
