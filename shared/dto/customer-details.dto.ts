import { AddressDTO } from "./address-dto.interface";
import { CustomerDTO } from "./customer-dto.interface";
import { DeliveryDTO } from "./delivery-dto.interface";
import { PackageDTO } from "./package-dto.interface";

export interface CustomerDetailsDTO {
  customer: CustomerDTO;
  packages: PackageDTO[];
  addresses: AddressDTO[];
  deliveries: DeliveryDTO[];
}
