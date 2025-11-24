import { CustomerDTO } from "@/shared/dto/customer-dto.interface";
import { WithoutId } from "@/shared/helper";
import { PrismaClient } from "@prisma/client";
import { ipcMain } from "electron";
import { CustomerRepositoryImpl } from "../implementations/repositories/customer-repository-impl";
import Registrable from "../interfaces/registrable.interface";
import { CustomerRepository } from "../interfaces/repositories/customer-repository.interface";

export default class CustomerIpc implements Registrable {

  private readonly _customerRepositoryImpl: CustomerRepository;

  constructor(
    client: PrismaClient
  ) {
    this._customerRepositoryImpl = new CustomerRepositoryImpl(client);
  }

  register() {
    ipcMain.handle('customer:insert', async (_event, customer: WithoutId<CustomerDTO>): Promise<string> => {
      return await this._customerRepositoryImpl.insert(customer);
    });

    ipcMain.handle('customer:findById', async (_event, id: string): Promise<CustomerDTO | null> => {
      const result = await this._customerRepositoryImpl.findById(id);
      if (!result) return null;
      return {
        id: result.id,
        email: result.email,
        phone: result.phone,
        firstName: result.firstName,
        lastName: result.lastName,
        birthdate: result.birthdate,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        billingAddressId: result.billingAddressId,
        deliveryAddressId: result.deliveryAddressId,
      } satisfies CustomerDTO;
    });

    ipcMain.handle('customer:findbyPage', async (_event, limit: number, page?: number): Promise<CustomerDTO[]> => {
      const results = await this._customerRepositoryImpl.findbyPage(limit, page);
      const customers: CustomerDTO[] = results.map(result => ({
        id: result.id,
        email: result.email,
        phone: result.phone,
        firstName: result.firstName,
        lastName: result.lastName,
        birthdate: result.birthdate,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        billingAddressId: result.billingAddressId,
        deliveryAddressId: result.deliveryAddressId,
      }));
      return customers;
    });

    ipcMain.handle('customer:deleteById', async (_event, id: string): Promise<void> => {
      await this._customerRepositoryImpl.deleteById(id);
    });

    ipcMain.handle('customer:updateById', async (_event, id: string, customer: CustomerDTO): Promise<void> => {
      return await this._customerRepositoryImpl.updateById(id, customer);
    });
  }
}
