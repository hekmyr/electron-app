import { CustomerDTO } from "@/shared/dto/customer-dto.interface";
import { WithoutId } from "@/shared/helper";
import { AddressDAO } from "../dao/address-dao.interface";
import { CustomerDAO } from "../dao/customer-dao.interface";
import { DeliveryDAO } from "../dao/delivery-dao.interface";
import { PackageDAO } from "../dao/package-dao.interface";

export type CustomerWithDetails = CustomerDAO & {
    packages: PackageDAO[];
    addresses: AddressDAO[];
    deliveries: (DeliveryDAO & { packages: { id: string }[] })[];
};

export interface CustomerRepository {
  findById: (id: string) => Promise<CustomerDAO>;
  findDetailsById: (id: string) => Promise<CustomerWithDetails | null>;
  findbyPage: (limit: number, page?: number) => Promise<CustomerDAO[]>;
  deleteById: (id: string) => Promise<void>;
  updateById: (id: string, customer: CustomerDTO) => Promise<void>;
  insert: (customer: WithoutId<CustomerDTO>) => Promise<string>;
}
