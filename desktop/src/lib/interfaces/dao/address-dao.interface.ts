export interface AddressDAO {
  id: string;
  street: string;
  houseNumber: string;
  boxNumber?: string | null;
  postalCode: string;
  city: string;
  countryCode: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}
