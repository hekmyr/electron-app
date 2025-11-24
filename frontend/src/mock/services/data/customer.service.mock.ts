import { signal } from "@angular/core";
import { AddressDTO } from "@shared/dto/address-dto.interface";
import { CustomerDetailsDTO } from "@shared/dto/customer-details.dto";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { DeliveryDTO } from "@shared/dto/delivery-dto.interface";
import { PackageDTO } from "@shared/dto/package-dto.interface";
import { WithoutId } from "@shared/helper";
import { CustomerService } from "@shared/services/customer-service.interface";
import { createMockCustomer } from "../../generate.mock";

type MockData = {
  customers: CustomerDTO[];
  addresses: AddressDTO[];
  packages: PackageDTO[];
  deliveries: DeliveryDTO[];
}
export class MockCustomerService implements CustomerService {
  private readonly _mock: MockData;
  private _customersSignal = signal<CustomerDTO[]>([]);

  constructor(mock: MockData) {
    this._mock = mock;
    this._customersSignal.set(mock.customers);
  }

  findById(id: string): Promise<CustomerDTO> {
    const customer = this._mock.customers.find(c => c.id === id);
    return Promise.resolve(customer ?? createMockCustomer({ id }));
  }

  findDetailsById(id: string): Promise<CustomerDetailsDTO | null> {
    const customer = this._mock.customers.find(c => c.id === id);
    if (!customer) {
      return Promise.resolve(null);
    }
    return Promise.resolve({
      customer: customer,
      packages: this._mock.packages.filter(p => p.customerId === id),
      addresses: this._mock.addresses.filter(a => a.customerId === id),
      deliveries: this._mock.deliveries.filter(d => d.customerId === id),
    });
  }

  findbyPage(limit: number, page?: number) {
    const customers = this._customersSignal()
    return Promise.resolve(customers.slice(0, limit));
  }
  deleteById(id: string) {
    return Promise.resolve();
  }
  insert(customer: WithoutId<CustomerDTO>) {
    return Promise.resolve('mock-id');
  }
  updateById(id: string, customer: CustomerDTO) {
    return Promise.resolve();
  }
}
