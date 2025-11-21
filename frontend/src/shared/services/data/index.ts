import { CustomerService, CustomerServiceImpl } from './customer.service';
import { PackageService, PackageServiceImpl } from './package.service';
import { ElectronService } from '@shared/services/electron-service.interface';

export interface DataService {
  customers: CustomerService;
  packages: PackageService;
}

export class DataServiceImpl implements DataService {

  public readonly customers: CustomerService;
  public readonly packages: PackageService;

  public constructor(public _electronService: ElectronService) {
    this.customers = new CustomerServiceImpl(this._electronService.persistence.customer);
    this.packages = new PackageServiceImpl(this._electronService.persistence.package);
  }
}
