import { PackageDTO } from "@/shared/dto/package-dto.interface";
import { WithoutId } from "@/shared/helper";
import { PackageService } from "@/shared/services/package-service.interface";
import { ipcRenderer } from "electron";

export const packageServiceImpl: PackageService = {
  insert: async (pkg: WithoutId<PackageDTO>) => {
    return await ipcRenderer.invoke('package:insert', pkg);
  },
  deleteById: async (id: string) => {
    await ipcRenderer.invoke('package:deleteById', id);
  },
  findById: async (id: string) => {
    return await ipcRenderer.invoke('package:findById', id);
  },
  updateById: async (id: string, pkg: PackageDTO) => {
    await ipcRenderer.invoke('package:updateById', id, pkg);
  }
};
