import { ReturnDTO } from "@/shared/dto/return-dto.interface";
import { WithoutId } from "@/shared/helper";
import { PrismaClient } from "@prisma/client";
import { ReturnRepository } from "../../interfaces/repositories/return-repository.interface";

export class ReturnRepositoryImpl implements ReturnRepository {

    constructor(
        private _client: PrismaClient
    ) { }

    async insert(returnData: WithoutId<ReturnDTO>): Promise<string> {
        const result = await this._client.return.create({
            data: {
                packageId: returnData.packageId,
                status: returnData.status,
                reason: returnData.reason,
            }
        });
        return result.id;
    }

    async findById(id: string) {
        return this._client.return.findUnique({
            where: { id }
        });
    }

    async findByPage(limit: number, page: number = 0) {
        const skip = page * limit;
        return this._client.return.findMany({
            take: limit,
            skip
        });
    }

    async deleteById(id: string): Promise<void> {
        await this._client.return.delete({
            where: { id }
        });
    }

    async updateById(id: string, returnData: ReturnDTO): Promise<void> {
        await this._client.return.update({
            where: { id },
            data: {
                packageId: returnData.packageId,
                status: returnData.status,
                reason: returnData.reason,
            }
        });
    }
}
