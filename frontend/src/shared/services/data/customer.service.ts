import { createMockCustomers } from "@/shared/mock/customer.mock";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";

export interface CustomerService {
    findCustomers(limit: number): CustomerDTO[];
}

export class CustomerServiceImpl implements CustomerService {

    public findCustomers(limit: number) {
        return createMockCustomers(limit);
    }
}