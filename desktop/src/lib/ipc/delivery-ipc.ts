import { DeliveryDTO, DeliveryStatus, isDeliveryStatus } from "@/shared/dto/delivery-dto.interface";
import { WithoutId } from "@/shared/helper";
import { PrismaClient } from "@prisma/client";
import { ipcMain } from "electron";
import { DeliveryRepositoryImpl } from "../implementations/repositories/delivery-repository-impl";
import Registrable from "../interfaces/registrable.interface";
import { DeliveryRepository } from "../interfaces/repositories/delivery-repository.interface";

export default class DeliveryIpc implements Registrable {

  private readonly _deliveryRepositoryImpl: DeliveryRepository;

  constructor(
    client: PrismaClient
  ) {
    this._deliveryRepositoryImpl = new DeliveryRepositoryImpl(client);
  }

  register() {
    ipcMain.handle('delivery:insert', async (_event, delivery: WithoutId<DeliveryDTO>): Promise<string> => {
        if (!isDeliveryStatus(delivery.status)) {
            throw new Error(`Invalid status: ${delivery.status}`);
        }
        return await this._deliveryRepositoryImpl.insert(delivery);
    });

    ipcMain.handle('delivery:findById', async (_event, id: string): Promise<DeliveryDTO | null> => {
      const result = await this._deliveryRepositoryImpl.findById(id);
      if (!result) return null;
      return {
        id: result.id,
        status: result.status as DeliveryStatus,
        scheduledAt: result.scheduledAt,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        customerId: result.customerId,
        addressId: result.addressId,
      } satisfies DeliveryDTO;
    });

    ipcMain.handle('delivery:findbyPage', async (_event, limit: number, page?: number): Promise<DeliveryDTO[]> => {
      const results = await this._deliveryRepositoryImpl.findbyPage(limit, page);
      return results.map(result => ({
        id: result.id,
        status: result.status as DeliveryStatus,
        scheduledAt: result.scheduledAt,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        customerId: result.customerId,
        addressId: result.addressId,
      }));
    });

    ipcMain.handle('delivery:deleteById', async (_event, id: string): Promise<void> => {
      await this._deliveryRepositoryImpl.deleteById(id);
    });

    ipcMain.handle('delivery:updateById', async (_event, id: string, delivery: DeliveryDTO): Promise<void> => {
       if (!isDeliveryStatus(delivery.status)) {
            throw new Error(`Invalid status: ${delivery.status}`);
        }
      return await this._deliveryRepositoryImpl.updateById(id, delivery);
    });
  }
}
