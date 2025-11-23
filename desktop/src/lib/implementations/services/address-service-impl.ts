import { WithoutId } from "@/shared/helper";
import { AddressService } from "@/shared/services/address-service.interface";
import { AddressDTO } from "@/shared/dto/address-dto.interface";
import { ipcRenderer } from "electron";

export const addressServiceImpl: AddressService = {
  insert: async (address: WithoutId<AddressDTO>) => {
    return await ipcRenderer.invoke('address:insert', address);
  },
  deleteById: async (id: string) => {
    await ipcRenderer.invoke('address:deleteById', id);
  },
  findById: async (id: string) => {
    return await ipcRenderer.invoke('address:findById', id);
  },
  updateById: async (id: string, address: AddressDTO) => {
    await ipcRenderer.invoke('address:updateById', id, address);
  },
  findAllByCustomerId: async (customerId: string) => {
    return await ipcRenderer.invoke('address:findAllByCustomerId', customerId);
  }
}
