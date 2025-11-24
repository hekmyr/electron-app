import { CustomerDTO } from "@/shared/dto/customer-dto.interface";
import { WithoutId } from "@/shared/helper";
import { CustomerService } from "@/shared/services/customer-service.interface";
import { ipcRenderer } from "electron";

export const customerServiceImpl: CustomerService = {
  insert: async (customer: WithoutId<CustomerDTO>) => {
    return await ipcRenderer.invoke('customer:insert', customer);
  },
  deleteById: async (id: string) => {
    await ipcRenderer.invoke('customer:deleteById', id);
  },
  findById: async (id: string) => {
    return await ipcRenderer.invoke('customer:findById', id);
  },
  findDetailsById: async (id: string) => {
    return await ipcRenderer.invoke('customer:findDetailsById', id);
  },
  updateById: async (id: string, customer: CustomerDTO) => {
    await ipcRenderer.invoke('customer:updateById', id, customer);
  },
  findbyPage: async (limit: number, page?: number) => {
    return await ipcRenderer.invoke('customer:findbyPage', limit, page);
  }
}
