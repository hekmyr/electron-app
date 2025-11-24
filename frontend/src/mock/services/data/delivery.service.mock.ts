import { signal } from "@angular/core";
import { DeliveryDTO } from "@shared/dto/delivery-dto.interface";
import { WithoutId } from "@shared/helper";
import { DeliveryService } from "@shared/services/delivery-service.interface";
import { createMockDelivery } from "../../generate.mock";

export class MockDeliveryService implements DeliveryService {

    private _deliveriesSignal = signal<DeliveryDTO[]>([]);

    constructor(initialDeliveries: DeliveryDTO[] = []) {
        this._deliveriesSignal.set(initialDeliveries);
    }

    findbyPage(limit: number, page?: number) {
        const deliveries = this._deliveriesSignal()
        return Promise.resolve(deliveries.slice(0, limit));
    }
    deleteById(id: string) {
        this._deliveriesSignal.update(deliveries => deliveries.filter(d => d.id !== id));
        return Promise.resolve();
    }
    insert(delivery: WithoutId<DeliveryDTO>) {
        const newDelivery = createMockDelivery(delivery);
        this._deliveriesSignal.update(deliveries => [...deliveries, newDelivery]);
        return Promise.resolve(newDelivery.id);
    }
    updateById(id: string, delivery: DeliveryDTO) {
        this._deliveriesSignal.update(deliveries => deliveries.map(d => d.id === id ? delivery : d));
        return Promise.resolve();
    }
}
