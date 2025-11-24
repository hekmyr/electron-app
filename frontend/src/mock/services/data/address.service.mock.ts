import { signal } from "@angular/core";
import { AddressDTO } from "@shared/dto/address-dto.interface";
import { WithoutId } from "@shared/helper";
import { AddressService } from "@shared/services/address-service.interface";
import { createMockAddress } from "../../generate.mock";

export class MockAddressService implements AddressService {

  private _addressesSignal = signal<AddressDTO[]>([]);

  constructor(initialAddresses: AddressDTO[] = []) {
    this._addressesSignal.set(initialAddresses);
  }

  findById(id: string): Promise<AddressDTO> {
    const address = this._addressesSignal().find(a => a.id === id);
    return Promise.resolve(address || createMockAddress({ id }));
  }

  findAllByCustomerId(customerId: string): Promise<AddressDTO[]> {
    const addresses = this._addressesSignal().filter(a => a.customerId === customerId);
    return Promise.resolve(addresses);
  }

  deleteById(id: string): Promise<void> {
    this._addressesSignal.update(addresses => addresses.filter(a => a.id !== id));
    return Promise.resolve();
  }

  insert(address: WithoutId<AddressDTO>): Promise<string> {
    const newAddress = createMockAddress(address);
    this._addressesSignal.update(addresses => [...addresses, newAddress]);
    return Promise.resolve(newAddress.id);
  }

  updateById(id: string, address: AddressDTO): Promise<void> {
    this._addressesSignal.update(addresses => addresses.map(a => a.id === id ? address : a));
    return Promise.resolve();
  }
}
