import { CustomerService, CustomerServiceImpl } from './customer.service';
import { PackageService, PackageServiceImpl } from './package.service';
import { AddressService, AddressServiceImpl } from './address.service';
import { DeliveryService, DeliveryServiceImpl } from './delivery.service';
import { ElectronService } from '@shared/services/electron-service.interface';

export interface DataService {
  customers: CustomerService;
  packages: PackageService;
  addresses: AddressService;
  deliveries: DeliveryService;
}

export class DataServiceImpl implements DataService {

  public readonly customers: CustomerService;
  public readonly packages: PackageService;
  public readonly addresses: AddressService;
  public readonly deliveries: DeliveryService;

  public constructor(public _electronService: ElectronService) {
    this.customers = new CustomerServiceImpl(this._electronService.persistence.customer);
    this.packages = new PackageServiceImpl(this._electronService.persistence.package);
    this.addresses = new AddressServiceImpl(this._electronService.persistence.address);
    this.deliveries = new DeliveryServiceImpl(this._electronService.persistence.delivery);
  }
}
