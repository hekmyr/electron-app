import { ReturnDTO } from "@/shared/dto/return-dto.interface";
import { WithoutId } from "@/shared/helper";
import { ReturnService } from "@/shared/services/return-service.interface";
import { ipcRenderer } from "electron";

export const returnServiceImpl: ReturnService = {
    insert: async (returnData: WithoutId<ReturnDTO>) => {
        return await ipcRenderer.invoke('return:insert', returnData);
    },
    deleteById: async (id: string) => {
        await ipcRenderer.invoke('return:deleteById', id);
    },
    findById: async (id: string) => {
        return await ipcRenderer.invoke('return:findById', id);
    },
    updateById: async (id: string, returnData: ReturnDTO) => {
        await ipcRenderer.invoke('return:updateById', id, returnData);
    },
    findbyPage: async (limit: number, page?: number) => {
        return await ipcRenderer.invoke('return:findbyPage', limit, page);
    }
}
