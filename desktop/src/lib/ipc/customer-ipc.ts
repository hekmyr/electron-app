import { ipcMain } from "electron";
import { CustomerRepository } from "../interfaces/repositories/customer-repository.interface";
import Registrable from "../interfaces/registrable.interface";
import { WithoutId } from "@/shared/helper";
import { CustomerDTO } from "@/shared/dto/customer-dto.interface";
import { PrismaClient } from "@prisma/client";
import { CustomerRepositoryImpl } from "../implementations/repositories/customer-repository-impl";

export default class CustomerIpc implements Registrable {

  private readonly _customerRepositoryImpl: CustomerRepository;

  constructor(
    client: PrismaClient
  ) {
    this._customerRepositoryImpl = new CustomerRepositoryImpl(client);
  }

  register() {
    ipcMain.handle('customer:insert', async (_event, customer: WithoutId<CustomerDTO>) => {
      return await this._customerRepositoryImpl.insert(customer);
    });

    ipcMain.handle('customer:findById', async (_event, id: string) => {
      const result = await this._customerRepositoryImpl.findById(id);
      if (!result) return null;
      return {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        birthdate: result.birthdate
      };
    });

    ipcMain.handle('customer:deleteById', async (_event, id: string) => {
      await this._customerRepositoryImpl.deleteById(id);
    });

    ipcMain.handle('customer:updateById', async (_event, id: string, customer: CustomerDTO) => {
      await this._customerRepositoryImpl.updateById(id, customer);
    });

  }
}
