import { ReturnDTO } from "@/shared/dto/return-dto.interface";
import { WithoutId } from "@/shared/helper";
import { ReturnDAO } from "../dao/return-dao.interface";

export interface ReturnRepository {
    findById: (id: string) => Promise<ReturnDAO>;
    findByPage: (limit: number, page?: number) => Promise<ReturnDAO[]>;
    deleteById: (id: string) => Promise<void>;
    updateById: (id: string, returnData: ReturnDTO) => Promise<void>;
    insert: (returnData: WithoutId<ReturnDTO>) => Promise<string>;
}
