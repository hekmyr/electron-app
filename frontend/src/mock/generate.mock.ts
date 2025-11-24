import { AddressDTO } from "@shared/dto/address-dto.interface";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { PackageDTO } from "@shared/dto/package-dto.interface";
import { DeliveryDTO } from "@shared/dto/delivery-dto.interface";
import { ReturnDTO } from "@shared/dto/return-dto.interface";

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
 * Create a mock AddressDTO
 * @param overrides - Partial fields to override on the generated mock
 */
export function createMockAddress(overrides?: Partial<AddressDTO>) {
  const now = new Date();
  const defaults: AddressDTO = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    street: `Main Street ${Math.floor(Math.random() * 100)}`,
    houseNumber: `${Math.floor(Math.random() * 100)}`,
    boxNumber: `${Math.floor(Math.random() * 10)}`,
    postalCode: `${Math.floor(1000 + Math.random() * 9000)}`,
    city: 'New York',
    countryCode: 'US',
    customerId: `${Math.floor(Math.random() * 10000)}`,
    createdAt: now,
    updatedAt: now,
  };
  return { ...defaults, ...overrides };
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



/**
 * Create a mock DeliveryDTO
 * @param overrides - Partial fields to override on the generated mock
 */
export function createMockDelivery(overrides?: Partial<DeliveryDTO>) {
  const defaults: DeliveryDTO = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    customerId: `${Math.floor(Math.random() * 10000)}`,
    status: 'scheduled',
    addressId: `${Math.floor(Math.random() * 10000)}`,
    packageIds: [`${Math.floor(Math.random() * 10000)}`],
    instructions: `Instructions for delivery ${Math.floor(Math.random() * 100)}`,
    scheduledAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  return { ...defaults, ...overrides };
}

export function createMockDeliveries(count: number = 3) {
  const out: DeliveryDTO[] = [];
  for (let i = 1; i <= count; i++) {
    out.push(createMockDelivery());
  }
  return out;
}

/**
 * Create a mock ReturnDTO
 * @param overrides - Partial fields to override on the generated mock
 */
export function createMockReturn(overrides?: Partial<ReturnDTO>) {
  const statuses = ['pending', 'approved', 'rejected', 'completed'] as const;
  const reasons = [
    'Damaged during shipping',
    'Wrong item received',
    'Item not as described',
    'No longer needed',
    'Defective product'
  ];
  const defaults: ReturnDTO = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    packageId: `${Math.floor(Math.random() * 10000)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  return { ...defaults, ...overrides };
}

export function createMockReturns(count: number = 3) {
  const out: ReturnDTO[] = [];
  for (let i = 1; i <= count; i++) {
    out.push(createMockReturn());
  }
  return out;
}

export function generateMocks(customerLimit: number) {
  const customers: CustomerDTO[] = [];
  const addresses: AddressDTO[] = [];
  const packages: PackageDTO[] = [];
  const deliveries: DeliveryDTO[] = [];
  const returns: ReturnDTO[] = [];

  for (let i = 1; i <= customerLimit; i++) {
    const customer = createMockCustomer({
      firstName: `Test ${i}`,
      lastName: `User ${i}`,
    });
    customers.push(customer);

    // Create 5 addresses for this customer
    for (let j = 1; j <= 5; j++) {
      const address = createMockAddress({
        customerId: customer.id,
        street: `Street ${j} for ${customer.firstName}`,
        city: `City ${j}`
      });
      addresses.push(address);

      // Create 1 delivery for each address
      deliveries.push(createMockDelivery({
        customerId: customer.id,
        addressId: address.id,
        packageIds: [] // Will populate below
      }));
    }

    // Create 5 packages for this customer
    for (let k = 1; k <= 5; k++) {
      const pkg = createMockPackage({
        customerId: customer.id,
        name: `Package ${k} for ${customer.firstName}`,
        description: `Description for package ${k} of customer ${customer.firstName}`
      });
      packages.push(pkg);

      // Assign package to a random delivery for this customer (simplification)
      // In a real scenario, we'd match address, but here we just pick one of the 5 deliveries we just made
      const deliveryIndex = (i - 1) * 5 + (k % 5);
      if (deliveries[deliveryIndex]) {
        deliveries[deliveryIndex].packageIds.push(pkg.id);
      }

      // Create a return for some packages (30% chance)
      if (Math.random() < 0.3) {
        returns.push(createMockReturn({
          packageId: pkg.id
        }));
      }
    }
  }

  return { customers, addresses, packages, deliveries, returns };
}

