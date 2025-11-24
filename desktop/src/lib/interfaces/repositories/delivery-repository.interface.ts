import { DeliveryDTO } from "@/shared/dto/delivery-dto.interface";
import { DeliveryDAO } from "../dao/delivery-dao.interface";
import { WithoutId } from "@/shared/helper";

export type DeliveryWithPackages = DeliveryDAO & { packages: { id: string }[] };

export interface DeliveryRepository {
  findById: (id: string) => Promise<DeliveryWithPackages | null>;
  findbyPage: (limit: number, page?: number) => Promise<DeliveryWithPackages[]>;
  deleteById: (id: string) => Promise<void>;
  updateById: (id: string, delivery: DeliveryDTO) => Promise<void>;
  insert: (delivery: WithoutId<DeliveryDTO>) => Promise<string>;
}