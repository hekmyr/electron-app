import { Injectable } from '@angular/core';
import { CustomerService, CustomerServiceImpl } from './customer.service';

export interface DataService {
    customers: CustomerService;
}

@Injectable({ providedIn: 'root' })
export class DataServiceImpl implements DataService {
  
    public readonly customers: CustomerService = new CustomerServiceImpl();
}
