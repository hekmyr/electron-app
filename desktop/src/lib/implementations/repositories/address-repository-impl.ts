import { AddressDTO } from "@/shared/dto/address-dto.interface";
import { WithoutId } from "@/shared/helper";
import { PrismaClient } from "@prisma/client";
import { AddressRepository } from "../../interfaces/repositories/address-repository.interface";

export class AddressRepositoryImpl implements AddressRepository {

  constructor(
    private _client: PrismaClient
  ) { }

  async insert(address: WithoutId<AddressDTO>) {
    const result = await this._client.address.create({
      data: {
        street: address.street,
        houseNumber: address.houseNumber,
        boxNumber: address.boxNumber,
        postalCode: address.postalCode,
        city: address.city,
        countryCode: address.countryCode,
        customerId: address.customerId,
      }
    });
    return result.id;
  }

  async findById(id: string) {
    const address = await this._client.address.findUnique({
      where: { id }
    });
    return address;
  }

  async findAllByCustomerId(customerId: string) {
    return this._client.address.findMany({
      where: { customerId }
    });
  }

  async deleteById(id: string) {
    await this._client.address.delete({
      where: { id }
    });
  }

  async updateById(id: string, address: AddressDTO) {
    await this._client.address.update({
      where: { id },
      data: {
        street: address.street,
        houseNumber: address.houseNumber,
        boxNumber: address.boxNumber,
        postalCode: address.postalCode,
        city: address.city,
        countryCode: address.countryCode,
      }
    });
  }
}
