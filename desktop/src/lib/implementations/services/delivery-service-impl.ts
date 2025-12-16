import { WithoutId } from "@/shared/helper";
import { DeliveryService } from "@/shared/services/delivery-service.interface";
import { DeliveryDTO } from "@/shared/dto/delivery-dto.interface";
import { ipcRenderer } from "electron";

export const deliveryServiceImpl: DeliveryService = {
  insert: async (delivery: WithoutId<DeliveryDTO>) => {
    return await ipcRenderer.invoke('delivery:insert', delivery);
  },
  deleteById: async (id: string) => {
    await ipcRenderer.invoke('delivery:deleteById', id);
  },
  updateById: async (id: string, delivery: DeliveryDTO) => {
    await ipcRenderer.invoke('delivery:updateById', id, delivery);
  },
  findbyPage: async (limit: number, page?: number) => {
    return await ipcRenderer.invoke('delivery:findbyPage', limit, page);
  },
  findById: async (id: string) => {
    return await ipcRenderer.invoke('delivery:findById', id);
  }
}
