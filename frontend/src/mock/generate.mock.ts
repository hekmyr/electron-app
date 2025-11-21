import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { PackageDTO } from "@shared/dto/package-dto.interface";

/**
 * Create a mock CustomerDTO
 * @param overrides - Partial fields to override on the generated mock
 */
export function createMockCustomer(overrides?: Partial<CustomerDTO>) {
  const now = new Date();
  const defaults: CustomerDTO = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    email: `john.doe.${Math.floor(Math.random() * 10000)}@example.com`,
    phone: `+1-555-${Math.floor(1000000 + Math.random() * 9000000)}`,
    firstName: 'John',
    lastName: 'Doe',
    birthdate: new Date('1990-01-01'),
    createdAt: now,
    updatedAt: now,
  };
  return { ...defaults, ...overrides };
}

export function createMockCustomers(count: number = 3) {
  const out: CustomerDTO[] = [];
  for (let i = 1; i <= count; i++) {
    out.push(createMockCustomer({
      firstName: `Test ${i}`,
      lastName: `User ${i}`,
    }));
  }
  return out;
}

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
