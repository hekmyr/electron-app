import { DeliveryDTO } from "@/shared/dto/delivery-dto.interface";
import { WithoutId } from "@/shared/helper";
import { PrismaClient } from "@prisma/client";
import { DeliveryRepository, DeliveryWithPackages } from "../../interfaces/repositories/delivery-repository.interface";

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
        packages: {
          connect: delivery.packageIds.map(id => ({ id }))
        }
      }
    });
    return result.id;
  }

  async findById(id: string): Promise<DeliveryWithPackages | null> {
    return this._client.delivery.findUnique({
      where: { id },
      include: {
        packages: {
          select: { id: true }
        }
      }
    }) as Promise<DeliveryWithPackages | null>;
  }

  async findbyPage(limit: number, page: number = 0): Promise<DeliveryWithPackages[]> {
    const skip = page * limit;
    return this._client.delivery.findMany({
      take: limit,
      skip,
      include: {
        packages: {
          select: { id: true }
        }
      }
    }) as Promise<DeliveryWithPackages[]>;
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
        packages: {
            set: delivery.packageIds.map(id => ({ id }))
        }
      }
    });
  }
}
