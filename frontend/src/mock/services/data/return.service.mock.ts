import { signal } from "@angular/core";
import { ReturnDTO } from "@shared/dto/return-dto.interface";
import { WithoutId } from "@shared/helper";
import { ReturnService } from "@shared/services/return-service.interface";
import { createMockReturn } from "../../generate.mock";

export class MockReturnService implements ReturnService {
    private _returnsSignal = signal<ReturnDTO[]>([]);

    constructor(initialReturns: ReturnDTO[]) {
        this._returnsSignal.set(initialReturns);
    }

    findById(id: string): Promise<ReturnDTO> {
        const returnData = this._returnsSignal().find(r => r.id === id);
        return Promise.resolve(returnData ?? createMockReturn({ id }));
    }

    findbyPage(limit: number, page?: number) {
        const returns = this._returnsSignal()
        return Promise.resolve(returns.slice(0, limit));
    }

    deleteById(id: string) {
        this._returnsSignal.update(returns => returns.filter(r => r.id !== id));
        return Promise.resolve();
    }

    insert(returnData: WithoutId<ReturnDTO>) {
        const id = crypto.randomUUID();
        const newReturn: ReturnDTO = {
            id,
            ...returnData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this._returnsSignal.update(returns => [newReturn, ...returns]);
        return Promise.resolve(id);
    }

    updateById(id: string, returnData: ReturnDTO) {
        this._returnsSignal.update(returns => returns.map(r => r.id === id ? returnData : r));
        return Promise.resolve();
    }
}
