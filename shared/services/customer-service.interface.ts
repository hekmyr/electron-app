import { CustomerDetailsDTO } from "../dto/customer-details.dto";
import { CustomerDTO } from "../dto/customer-dto.interface";
import { WithoutId } from "../helper";

export interface CustomerService {
  findById: (id: string) => Promise<CustomerDTO>;
  findDetailsById: (id: string) => Promise<CustomerDetailsDTO | null>;
  findbyPage: (limit: number, page?: number) => Promise<CustomerDTO[]>;
  deleteById: (id: string) => Promise<void>;
  insert: (customer: WithoutId<CustomerDTO>) => Promise<string>;
  updateById: (id: string, customer: CustomerDTO) => Promise<void>;
}
