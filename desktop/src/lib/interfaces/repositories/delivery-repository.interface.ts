import { DeliveryDTO } from "@/shared/dto/delivery-dto.interface";
import { DeliveryDAO } from "../dao/delivery-dao.interface";
import { WithoutId } from "@/shared/helper";

export interface DeliveryRepository {
  findById: (id: string) => Promise<DeliveryDAO | null>;
  findbyPage: (limit: number, page?: number) => Promise<DeliveryDAO[]>;
  deleteById: (id: string) => Promise<void>;
  updateById: (id: string, delivery: DeliveryDTO) => Promise<void>;
  insert: (delivery: WithoutId<DeliveryDTO>) => Promise<string>;
}