import { AddressDTO } from "@shared/dto/address-dto.interface";
import * as SharedServices from '@shared/services';
import { WithoutId } from "@shared/helper";

export interface AddressService {
  findAllByCustomerId(customerId: string): Promise<AddressDTO[]>;
  createAddress(address: WithoutId<AddressDTO>): Promise<string>;
  deleteAddress(id: string): Promise<void>;
  updateAddress(id: string, address: AddressDTO): Promise<void>;
}

export class AddressServiceImpl implements AddressService {

  public constructor(
    private _addressService: SharedServices.AddressService
  ) { }

  public async findAllByCustomerId(customerId: string): Promise<AddressDTO[]> {
    return await this._addressService.findAllByCustomerId(customerId);
  }

  public async createAddress(address: WithoutId<AddressDTO>): Promise<string> {
    return await this._addressService.insert(address);
  }

  public async deleteAddress(id: string): Promise<void> {
    await this._addressService.deleteById(id);
  }

  public async updateAddress(id: string, address: AddressDTO): Promise<void> {
    await this._addressService.updateById(id, address);
  }
}
