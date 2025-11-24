import { signal } from "@angular/core";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { WithoutId } from "@shared/helper";
import { CustomerService } from "@shared/services/customer-service.interface";
import { createMockCustomer, createMockCustomers } from "../../generate.mock";

export class MockCustomerService implements CustomerService {

  private _customersSignal = signal<CustomerDTO[]>([]);

  constructor(initialCustomers: CustomerDTO[] = []) {
    this._customersSignal.set(initialCustomers);
  }

  findById(id: string): Promise<CustomerDTO> {
    return Promise.resolve(createMockCustomer({ id }));
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
