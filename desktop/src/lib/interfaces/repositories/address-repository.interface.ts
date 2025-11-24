import { AddressDTO } from "../../../../../shared/dto/address-dto.interface";
import { AddressDAO } from "../dao/address-dao.interface";
import { WithoutId } from "../../../../../shared/helper";

export interface AddressRepository {
  findById: (id: string) => Promise<AddressDAO | null>;
  findAllByCustomerId: (customerId: string) => Promise<AddressDAO[]>;
  deleteById: (id: string) => Promise<void>;
  updateById: (id: string, address: AddressDTO) => Promise<void>;
  insert: (address: WithoutId<AddressDTO>) => Promise<string>;
}
