import { DeliveryDTO } from "@/shared/dto/delivery-dto.interface";
import { WithoutId } from "@/shared/helper";
import { DeliveryRepository } from "../../interfaces/repositories/delivery-repository.interface";
import { PrismaClient } from "@prisma/client";
import { DeliveryDAO } from "../../interfaces/dao/delivery-dao.interface";

export class DeliveryRepositoryImpl implements DeliveryRepository {

  constructor(
    private _client: PrismaClient
  ) { }

  async insert(delivery: WithoutId<DeliveryDTO>): Promise<string> {
    const result = await this._client.delivery.create({
      data: {
        status: delivery.status,
        scheduledAt: delivery.scheduledAt,
        customerId: delivery.customerId,
        addressId: delivery.addressId,
      }
    });
    return result.id;
  }

  async findById(id: string): Promise<DeliveryDAO | null> {
    return this._client.delivery.findUnique({
      where: { id },
    });
  }

  async findbyPage(limit: number, page: number = 0): Promise<DeliveryDAO[]> {
    const skip = page * limit;
    return this._client.delivery.findMany({
      take: limit,
      skip,
    });
  }

  async deleteById(id: string): Promise<void> {
    await this._client.delivery.delete({
      where: { id }
    });
  }

  async updateById(id: string, delivery: DeliveryDTO): Promise<void> {
    await this._client.delivery.update({
      where: { id },
      data: {
        status: delivery.status,
        scheduledAt: delivery.scheduledAt,
        customerId: delivery.customerId,
        addressId: delivery.addressId,
      }
    });
  }
}
