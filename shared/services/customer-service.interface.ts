import { CustomerDTO } from "../dto/customer-dto.interface";
import { WithoutId } from "../helper";

export interface CustomerService {
  findById: (id: string) => Promise<CustomerDTO>;
  deleteById: (id: string) => Promise<void>;
  insert: (customer: WithoutId<CustomerDTO>) => Promise<string>;
  updateById: (id: string, customer: CustomerDTO) => Promise<void>;
}
