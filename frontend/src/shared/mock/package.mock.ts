import { PackageDTO } from "@shared/dto/package-dto.interface";
import { createMockCustomers } from "./customer.mock";

/**
 * Create a mock PackageDTO
 * @param overrides - Partial fields to override on the generated mock
 */
export function createMockPackage(overrides?: Partial<PackageDTO>) {
    const defaults: PackageDTO = {
        id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        name: `Package ${Math.floor(Math.random() * 100)}`,
        description: `Description for package ${Math.floor(Math.random() * 100)}`,
        customerId: `${Math.floor(Math.random() * 10000)}`,
        status: 'received',
        receivedAt: new Date(),
        createdAt: new Date()
    };
    return { ...defaults, ...overrides };
}

export function createMockPackages(count: number = 3) {
    const customers = createMockCustomers(count);
    const out: PackageDTO[] = [];

    customers.forEach(customer => {
        for (let i = 1; i <= 5; i++) {
            out.push(createMockPackage({
                name: `Package ${i} for ${customer.firstName}`,
                customerId: customer.id,
                description: `Package ${i} description for customer ${customer.id}`
            }));
        }
    });

    return out;
}

export default createMockPackage;
