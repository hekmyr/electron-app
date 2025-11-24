import { AddressService } from "./address-service.interface";
import { CustomerService } from "./customer-service.interface";
import { PackageService } from "./package-service.interface";

export interface PersistenceService {
  customer: CustomerService;
  package: PackageService;
  address: AddressService;
}
