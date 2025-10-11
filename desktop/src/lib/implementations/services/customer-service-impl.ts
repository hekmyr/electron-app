import { WithoutId } from "@/shared/helper";
import { CustomerService } from "@/shared/services/customer-service.interface";
import { Customer } from "@prisma/client";
import { ipcRenderer } from "electron";

export const customerServiceImpl: CustomerService = {
  insert: async (customer: WithoutId<Customer>) => {
    return await ipcRenderer.invoke('customer:insert', customer);
  },
  deleteById: async (id: string) => {
    await ipcRenderer.invoke('customer:deleteById', id);
  },
  findById: async (id: string) => {
    return await ipcRenderer.invoke('customer:findById', id);
  },
  updateById: async (id: string, customer: Customer) => {
    await ipcRenderer.invoke('customer:updateById', id, customer);
  }
}
