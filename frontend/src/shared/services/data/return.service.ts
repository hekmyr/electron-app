import { ReturnDTO } from "@shared/dto/return-dto.interface";
import * as SharedServices from '@shared/services';

export interface ReturnService {
    findReturns(limit: number): Promise<Map<string, ReturnDTO>>;
    updateReturn(id: string, returnData: ReturnDTO): Promise<void>;
    createReturn(returnData: ReturnDTO): Promise<void>;
    deleteReturn(id: string): Promise<void>;
}

export class ReturnServiceImpl implements ReturnService {

    public constructor(
        private _returnService: SharedServices.ReturnService
    ) { }

    public async findReturns(limit: number) {
        const returns = await this._returnService.findbyPage(limit);
        const map = new Map<string, ReturnDTO>();
        returns.forEach(returnData => map.set(returnData.id, returnData));
        return map;
    }

    public async updateReturn(id: string, returnData: ReturnDTO) {
        await this._returnService.updateById(id, returnData);
    }

    public async createReturn(returnData: ReturnDTO) {
        await this._returnService.insert(returnData);
    }

    public async deleteReturn(id: string) {
        await this._returnService.deleteById(id);
    }
}
