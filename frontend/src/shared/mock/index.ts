import { Injectable, signal } from "@angular/core";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { PackageDTO } from "@shared/dto/package-dto.interface";
import { createMockCustomers } from "./customer.mock";
import { createMockPackages } from "./package.mock";

@Injectable({
  providedIn: 'root'
})
export class MockService {
  private _customersSignal = signal<CustomerDTO[]>(createMockCustomers(50));
  private _packagesSignal = signal<PackageDTO[]>(createMockPackages(50));

  public set customersSignal(value: CustomerDTO[]) {
    this._customersSignal.set(value);
  }

  public findCustomers(limit: number) {
    return this._customersSignal().slice(0, limit);
  }

  public findPackages(limit: number) {
    return this._packagesSignal().slice(0, limit);
  }
}