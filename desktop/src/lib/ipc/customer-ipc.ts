import { CustomerDTO } from "@/shared/dto/customer-dto.interface";
import { CustomerDetailsDTO } from "@/shared/dto/customer-details.dto";
import { DeliveryStatus } from "@/shared/dto/delivery-dto.interface";
import { WithoutId, calculateAge, MIN_AGE } from "@/shared/helper";
import { PrismaClient } from "@prisma/client";
import { ipcMain } from "electron";
import { CustomerRepositoryImpl } from "../implementations/repositories/customer-repository-impl";
import Registrable from "../interfaces/registrable.interface";
import { CustomerRepository } from "../interfaces/repositories/customer-repository.interface";
import { AppError } from "@/shared/errors";

export default class CustomerIpc implements Registrable {

  private readonly _customerRepositoryImpl: CustomerRepository;

  constructor(
    client: PrismaClient
  ) {
    this._customerRepositoryImpl = new CustomerRepositoryImpl(client);
  }

  private _validateAge(birthdateInput: Date | string) {
    if (calculateAge(birthdateInput) < MIN_AGE) {
      throw new AppError('INVALID_ARGUMENT', `Customer must be at least ${MIN_AGE} years old.`);
    }
  }

  register() {
    ipcMain.handle('customer:insert', async (_event, customer: WithoutId<CustomerDTO>): Promise<string> => {
      this._validateAge(customer.birthdate);
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

    ipcMain.handle('customer:findDetailsById', async (_event, id: string): Promise<CustomerDetailsDTO | null> => {
        const result = await this._customerRepositoryImpl.findDetailsById(id);
        if (!result) return null;

        const customer: CustomerDTO = {
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
        };

        return {
            customer,
            packages: result.packages.map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                status: p.status, // TODO: Type cast if needed
                receivedAt: p.receivedAt,
                deliveredAt: p.deliveredAt,
                outForDeliveryAt: p.outForDeliveryAt,
                customerId: p.customerId,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                deliveryId: p.deliveryId,
            })),
            addresses: result.addresses.map(a => ({
                id: a.id,
                street: a.street,
                houseNumber: a.houseNumber,
                boxNumber: a.boxNumber,
                postalCode: a.postalCode,
                city: a.city,
                countryCode: a.countryCode,
                customerId: a.customerId,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt,
            })),
            deliveries: result.deliveries.map(d => ({
                id: d.id,
                customerId: d.customerId,
                status: d.status as DeliveryStatus,
                addressId: d.addressId,
                packageIds: d.packages.map(p => p.id),
                // instructions: d.instructions, // DeliveryDAO doesn't have instructions? Check schema.
                scheduledAt: d.scheduledAt,
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
            }))
        };
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
      this._validateAge(customer.birthdate);
      return await this._customerRepositoryImpl.updateById(id, customer);
    });
  }
}
