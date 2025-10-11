import { WithoutId } from "@/shared/helper";
import { PackageRepository } from "../../interfaces/repositories/package-repository.interface";
import { PrismaClient } from "@prisma/client";
import { PackageDTO } from "@/shared/dto/package-dto.interface";

export class PackageRepositoryImpl implements PackageRepository {

  constructor(
    private _client: PrismaClient
  ) { }

  async insert(pkg: WithoutId<PackageDTO>): Promise<string> {
    const result = await this._client.package.create({
      data: {
        name: pkg.name,
        description: pkg.description,
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
        customerId: pkg.customerId
      }
    });
  }
}
