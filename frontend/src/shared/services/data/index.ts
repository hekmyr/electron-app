import { Injectable } from '@angular/core';
import { CustomerService, CustomerServiceImpl } from './customer.service';
import { PackageService, PackageServiceImpl } from './package.service';

export interface DataService {
    customers: CustomerService;
    packages: PackageService;
}

@Injectable({ providedIn: 'root' })
export class DataServiceImpl implements DataService {

    public readonly customers: CustomerService = new CustomerServiceImpl();
    public readonly packages: PackageService = new PackageServiceImpl();
}
