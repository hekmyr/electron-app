import { CustomerDTO } from "@/shared/dto/customer-dto.interface";
import { CustomerDAO } from "../dao/customer-dao.interface";
import { WithoutId } from "@/shared/helper";

export interface CustomerRepository {
  findById: (id: string) => Promise<CustomerDAO>;
  deleteById: (id: string) => Promise<void>;
  updateById: (id: string, customer: CustomerDTO) => Promise<void>;
  insert: (customer: WithoutId<CustomerDTO>) => Promise<string>;
}
