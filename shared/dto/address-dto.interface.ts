export interface AddressDTO {
  id: string;
  street: string;
  houseNumber: string;
  boxNumber?: string;
  postalCode: string;
  city: string;
  countryCode: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}
