import { DeliveryDTO } from "../dto/delivery-dto.interface";
import { WithoutId } from "../helper";

export interface DeliveryService {
    findbyPage(limit: number, page?: number): Promise<DeliveryDTO[]>;
    updateById(id: string, delivery: DeliveryDTO): Promise<void>;
    insert(delivery: WithoutId<DeliveryDTO>): Promise<string>;
    deleteById(id: string): Promise<void>;
}
