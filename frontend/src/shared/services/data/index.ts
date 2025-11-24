import { ElectronService } from "@shared/services";
import { AddressService, AddressServiceImpl } from "./address.service";
import { CustomerService, CustomerServiceImpl } from "./customer.service";
import { DeliveryService, DeliveryServiceImpl } from "./delivery.service";
import { PackageService, PackageServiceImpl } from "./package.service";
import { ReturnService, ReturnServiceImpl } from "./return.service";
import { MockAddressService } from "@/mock/services/data/address.service.mock";
import { MockCustomerService } from "@/mock/services/data/customer.service.mock";
import { MockDeliveryService } from "@/mock/services/data/delivery.service.mock";
import { MockPackageService } from "@/mock/services/data/package.service.mock";
import { MockReturnService } from "@/mock/services/data/return.service.mock";
import { generateMocks } from "@/mock/generate.mock";

export interface DataService {
  customers: CustomerService;
  packages: PackageService;
  addresses: AddressService;
  deliveries: DeliveryService;
  returns: ReturnService;
}

export class DataServiceImpl implements DataService {
  public readonly customers: CustomerService;
  public readonly packages: PackageService;
  public readonly addresses: AddressService;
  public readonly deliveries: DeliveryService;
  public readonly returns: ReturnService;

  constructor(electronService: ElectronService) {
    this.customers = new CustomerServiceImpl(electronService.persistence.customer);
    this.packages = new PackageServiceImpl(electronService.persistence.package);
    this.addresses = new AddressServiceImpl(electronService.persistence.address);
    this.deliveries = new DeliveryServiceImpl(electronService.persistence.delivery);
    this.returns = new ReturnServiceImpl(electronService.persistence.return);
  }
}

