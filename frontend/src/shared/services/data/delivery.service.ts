import { DeliveryDTO } from "@shared/dto/delivery-dto.interface";
import * as SharedServices from '@shared/services';

export interface DeliveryService {
    findDeliveries(limit: number): Promise<Map<string, DeliveryDTO>>;
    updateDelivery(id: string, delivery: DeliveryDTO): Promise<void>;
    createDelivery(delivery: DeliveryDTO): Promise<void>;
    deleteDelivery(id: string): Promise<void>;
}

export class DeliveryServiceImpl implements DeliveryService {

    constructor(
        private _deliveryService: SharedServices.DeliveryService
    ) { }

    public async findDeliveries(limit: number): Promise<Map<string, DeliveryDTO>> {
        const deliveries = await this._deliveryService.findbyPage(limit);
        const map = new Map<string, DeliveryDTO>();
        deliveries.forEach(d => map.set(d.id, d));
        return map;
    }

    public async updateDelivery(id: string, delivery: DeliveryDTO): Promise<void> {
        await this._deliveryService.updateById(id, delivery);
    }

    public async createDelivery(delivery: DeliveryDTO): Promise<void> {
        await this._deliveryService.insert(delivery);
    }

    public async deleteDelivery(id: string): Promise<void> {
        await this._deliveryService.deleteById(id);
    }
}
