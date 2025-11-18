import { createMockCustomers } from "@/shared/mock/customer.mock";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";

export interface CustomerService {
    findCustomers(limit: number): Map<string, CustomerDTO>;
    updateCustomer(id: string, customer: CustomerDTO): void;
    deleteCustomer(id: string): void;
}

export class CustomerServiceImpl implements CustomerService {

    public findCustomers(limit: number): Map<string, CustomerDTO> {
        const customers = createMockCustomers(limit);
        const map = new Map<string, CustomerDTO>();
        customers.forEach(customer => map.set(customer.id, customer));
        return map;
    }

    public updateCustomer(id: string, customer: CustomerDTO): void {
        // In a real app, this would update the backend
    }

    public deleteCustomer(id: string): void {
        // In a real app, this would delete from the backend
    }
}