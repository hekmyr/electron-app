import { ReturnDTO, isReturnStatus } from "@/shared/dto/return-dto.interface";
import { AppError } from "@/shared/errors";
import { WithoutId } from "@/shared/helper";
import { PrismaClient } from "@prisma/client";
import { ipcMain } from "electron";
import { ReturnRepositoryImpl } from "../implementations/repositories/return-repository-impl";
import Registrable from "../interfaces/registrable.interface";
import { ReturnRepository } from "../interfaces/repositories/return-repository.interface";

export default class ReturnIpc implements Registrable {

    private readonly _returnRepositoryImpl: ReturnRepository;

    constructor(client: PrismaClient) {
        this._returnRepositoryImpl = new ReturnRepositoryImpl(client);
    }

    register() {
        ipcMain.handle('return:insert', async (_event, returnData: WithoutId<ReturnDTO>): Promise<string> => {
            if (!isReturnStatus(returnData.status)) {
                throw new AppError("INVALID_ARGUMENT", `Invalid return status: ${returnData.status}`);
            }
            return await this._returnRepositoryImpl.insert(returnData);
        });

        ipcMain.handle('return:findById', async (_event, id: string): Promise<ReturnDTO | null> => {
            const result = await this._returnRepositoryImpl.findById(id);
            if (!result) return null;
            return {
                id: result.id,
                packageId: result.packageId,
                status: result.status,
                reason: result.reason,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
            };
        });

        ipcMain.handle('return:findbyPage', async (_event, limit: number, page?: number): Promise<ReturnDTO[]> => {
            const results = await this._returnRepositoryImpl.findByPage(limit, page);
            const dtos: ReturnDTO[] = [];
            for (const result of results) {
                dtos.push({
                    id: result.id,
                    packageId: result.packageId,
                    status: result.status,
                    reason: result.reason,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                });
            }
            return dtos;
        });

        ipcMain.handle('return:deleteById', async (_event, id: string): Promise<void> => {
            await this._returnRepositoryImpl.deleteById(id);
        });

        ipcMain.handle('return:updateById', async (_event, id: string, returnData: ReturnDTO) => {
            if (!isReturnStatus(returnData.status)) {
                throw new AppError("INVALID_ARGUMENT", `Invalid return status: ${returnData.status}`);
            }
            await this._returnRepositoryImpl.updateById(id, returnData);
        });
    }
}
