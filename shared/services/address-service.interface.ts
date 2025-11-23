import { AddressDTO } from "../dto/address-dto.interface";
import { WithoutId } from "../helper";

export interface AddressService {
  findById: (id: string) => Promise<AddressDTO>;
  findAllByCustomerId: (customerId: string) => Promise<AddressDTO[]>;
  deleteById: (id: string) => Promise<void>;
  insert: (address: WithoutId<AddressDTO>) => Promise<string>;
  updateById: (id: string, address: AddressDTO) => Promise<void>;
}
