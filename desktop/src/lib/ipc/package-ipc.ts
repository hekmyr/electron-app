import { ipcMain } from "electron";
import { PackageRepository } from "../interfaces/repositories/package-repository.interface";
import { PackageRepositoryImpl } from "../implementations/repositories/package-repository-impl";
import Registrable from "../interfaces/registrable.interface";
import { WithoutId } from "@/shared/helper";
import { PackageDTO } from "@/shared/dto/package-dto.interface";
import { PrismaClient } from "@prisma/client/extension";

export default class PackageIpc implements Registrable {

  private readonly _packageRepositoryImpl: PackageRepository;

  constructor(client: PrismaClient) {
    this._packageRepositoryImpl = new PackageRepositoryImpl(client);
  }

  register() {
    ipcMain.handle('package:insert', async (_event, pkg: WithoutId<PackageDTO>) => {
      return await this._packageRepositoryImpl.insert(pkg);
    });

    ipcMain.handle('package:findById', async (_event, id: string) => {
      const result = await this._packageRepositoryImpl.findById(id);
      if (!result) return null;
      return {
        id: result.id,
        customerId: result.customerId,
        name: result.name,
        description: result.description
      };
    });

    ipcMain.handle('package:deleteById', async (_event, id: string) => {
      await this._packageRepositoryImpl.deleteById(id);
    });

    ipcMain.handle('package:updateById', async (_event, id: string, pkg: PackageDTO) => {
      await this._packageRepositoryImpl.updateById(id, pkg);
    });
  }
}
