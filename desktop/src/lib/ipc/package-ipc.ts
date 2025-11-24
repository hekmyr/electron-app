import { PackageDTO, isPackageStatus } from "@/shared/dto/package-dto.interface";
import { AppError } from "@/shared/errors";
import { WithoutId } from "@/shared/helper";
import { PrismaClient } from "@prisma/client/extension";
import { ipcMain } from "electron";
import { PackageRepositoryImpl } from "../implementations/repositories/package-repository-impl";
import Registrable from "../interfaces/registrable.interface";
import { PackageRepository } from "../interfaces/repositories/package-repository.interface";

export default class PackageIpc implements Registrable {

  private readonly _packageRepositoryImpl: PackageRepository;

  constructor(client: PrismaClient) {
    this._packageRepositoryImpl = new PackageRepositoryImpl(client);
  }

  register() {
    ipcMain.handle('package:insert', async (_event, pkg: WithoutId<PackageDTO>): Promise<string> => {
      if (!isPackageStatus(pkg.status)) {
        throw new AppError("INVALID_ARGUMENT", `Invalid package status: ${pkg.status}`);
      }
      return await this._packageRepositoryImpl.insert(pkg);
    });

    ipcMain.handle('package:findById', async (_event, id: string): Promise<PackageDTO | null> => {
      const result = await this._packageRepositoryImpl.findById(id);
      if (!result) return null;
      return {
        id: result.id,
        customerId: result.customerId,
        name: result.name,
        description: result.description,
        status: result.status,
        receivedAt: result.receivedAt,
        deliveredAt: result.deliveredAt,
        outForDeliveryAt: result.outForDeliveryAt,
        createdAt: result.createdAt
      };
    });

    ipcMain.handle('package:findbyPage', async (_event, limit: number, page?: number): Promise<PackageDTO[]> => {
      const results = await this._packageRepositoryImpl.findByPage(limit, page);
      const dtos: PackageDTO[] = [];
      for (const result of results) {
        dtos.push({
          id: result.id,
          customerId: result.customerId,
          name: result.name,
          description: result.description,
          status: result.status,
          receivedAt: result.receivedAt,
          deliveredAt: result.deliveredAt,
          outForDeliveryAt: result.outForDeliveryAt,
          createdAt: result.createdAt
        });
      }
      return dtos;
    });

    ipcMain.handle('package:deleteById', async (_event, id: string): Promise<void> => {
      await this._packageRepositoryImpl.deleteById(id);
    });

    ipcMain.handle('package:updateById', async (_event, id: string, pkg: PackageDTO) => {
      if (!isPackageStatus(pkg.status)) {
        throw new AppError("INVALID_ARGUMENT", `Invalid package status: ${pkg.status}`);
      }
      await this._packageRepositoryImpl.updateById(id, pkg);
    });
  }
}
