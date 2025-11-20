import { MockService } from "@/shared/mock";
import { inject } from "@angular/core";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";

export interface CustomerService {
    findCustomers(limit: number): Map<string, CustomerDTO>;
    updateCustomer(id: string, customer: CustomerDTO): void;
    createCustomer(customer: CustomerDTO): void;
    deleteCustomer(id: string): void;
}

export class CustomerServiceImpl implements CustomerService {

    private readonly _mockService: MockService;

    public constructor() {
        this._mockService = inject(MockService);
    }

    public findCustomers(limit: number): Map<string, CustomerDTO> {
        const customers = this._mockService.findCustomers(limit);
        const map = new Map<string, CustomerDTO>();
        customers.forEach(customer => map.set(customer.id, customer));
        return map;
    }

    public updateCustomer(id: string, customer: CustomerDTO): void {
        // In a real app, this would update the backend
    }

    public createCustomer(customer: CustomerDTO): void {
        // In a real app, this would create the customer in the backend
    }

    public deleteCustomer(id: string): void {
        // In a real app, this would delete from the backend
    }
}