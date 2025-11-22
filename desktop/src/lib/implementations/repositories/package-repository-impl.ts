import { PackageDTO } from "@/shared/dto/package-dto.interface";
import { WithoutId } from "@/shared/helper";
import { PrismaClient } from "@prisma/client";
import { PackageRepository } from "../../interfaces/repositories/package-repository.interface";

export class PackageRepositoryImpl implements PackageRepository {

  constructor(
    private _client: PrismaClient
  ) { }

  async insert(pkg: WithoutId<PackageDTO>): Promise<string> {
    const result = await this._client.package.create({
      data: {
        name: pkg.name,
        description: pkg.description,
        status: pkg.status,
        receivedAt: pkg.receivedAt,
        deliveredAt: pkg.deliveredAt,
        outForDeliveryAt: pkg.outForDeliveryAt,
        customerId: pkg.customerId
      }
    });
    return result.id;
  }

  async findById(id: string) {
    return this._client.package.findUnique({
      where: {
        id
      }
    });
  }

  async findByPage(limit: number, page: number = 0) {
    const skip = page * limit;
    return this._client.package.findMany({
      take: limit,
      skip
    });
  }

  async deleteById(id: string): Promise<void> {
    await this._client.package.delete({
      where: {
        id
      }
    });
  }

  async updateById(id: string, pkg: PackageDTO): Promise<void> {
    await this._client.package.update({
      where: {
        id
      },
      data: {
        name: pkg.name,
        description: pkg.description,
        status: pkg.status,
        receivedAt: pkg.receivedAt,
        deliveredAt: pkg.deliveredAt,
        outForDeliveryAt: pkg.outForDeliveryAt,
        customerId: pkg.customerId
      }
    });
  }
}
