import { AddressDTO } from "@/shared/dto/address-dto.interface";
import { WithoutId } from "@/shared/helper";
import { PrismaClient } from "@prisma/client";
import { ipcMain } from "electron";
import { AddressRepositoryImpl } from "../implementations/repositories/address-repository-impl";
import Registrable from "../interfaces/registrable.interface";
import { AddressRepository } from "../interfaces/repositories/address-repository.interface";

export default class AddressIpc implements Registrable {

  private readonly _addressRepositoryImpl: AddressRepository;

  constructor(
    client: PrismaClient
  ) {
    this._addressRepositoryImpl = new AddressRepositoryImpl(client);
  }

  register() {
    ipcMain.handle('address:insert', async (_event, address: WithoutId<AddressDTO>): Promise<string> => {
      return await this._addressRepositoryImpl.insert(address);
    });

    ipcMain.handle('address:findById', async (_event, id: string): Promise<AddressDTO | null> => {
      const result = await this._addressRepositoryImpl.findById(id);
      return {
        id: result.id,
        street: result.street,
        houseNumber: result.houseNumber,
        boxNumber: result.boxNumber,
        postalCode: result.postalCode,
        city: result.city,
        countryCode: result.countryCode,
        customerId: result.customerId,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      };
    });

    ipcMain.handle('address:findAllByCustomerId', async (_event, customerId: string): Promise<AddressDTO[]> => {
      const results = await this._addressRepositoryImpl.findAllByCustomerId(customerId);
      const addresses: AddressDTO[] = results.map(result => ({
        id: result.id,
        street: result.street,
        houseNumber: result.houseNumber,
        boxNumber: result.boxNumber,
        postalCode: result.postalCode,
        city: result.city,
        countryCode: result.countryCode,
        customerId: result.customerId,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      }));
      return addresses;
    });

    ipcMain.handle('address:deleteById', async (_event, id: string): Promise<void> => {
      await this._addressRepositoryImpl.deleteById(id);
    });

    ipcMain.handle('address:updateById', async (_event, id: string, address: AddressDTO): Promise<void> => {
      await this._addressRepositoryImpl.updateById(id, address);
    });
  }
}
