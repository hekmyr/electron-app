import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import * as SharedServices from '@shared/services';

export interface CustomerService {
  findCustomers(limit: number): Promise<Map<string, CustomerDTO>>;
  updateCustomer(id: string, customer: CustomerDTO): Promise<void>;
  createCustomer(customer: CustomerDTO): Promise<void>;
  deleteCustomer(id: string): Promise<void>;
}

export class CustomerServiceImpl implements CustomerService {

  public constructor(
    private _customerService: SharedServices.CustomerService
  ) { }

  public async findCustomers(limit: number) {
    const customers = await this._customerService.findbyPage(limit);
    const map = new Map<string, CustomerDTO>();
    customers.forEach(customer => map.set(customer.id, customer));
    return map;
  }

  public async updateCustomer(id: string, customer: CustomerDTO) {
    await this._customerService.updateById(id, customer);
  }

  public async createCustomer(customer: CustomerDTO) {
    await this._customerService.insert(customer);
  }

  public async deleteCustomer(id: string) {
    await this._customerService.deleteById(id);
  }
}
