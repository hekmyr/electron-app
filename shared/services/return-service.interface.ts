import { ReturnDTO } from "../dto/return-dto.interface";
import { WithoutId } from "../helper";

export interface ReturnService {
    findById: (id: string) => Promise<ReturnDTO>;
    findbyPage: (limit: number, page?: number) => Promise<ReturnDTO[]>;
    deleteById: (id: string) => Promise<void>;
    insert: (returnData: WithoutId<ReturnDTO>) => Promise<string>;
    updateById: (id: string, returnData: ReturnDTO) => Promise<void>;
}
