import { CustomerDTO } from '../dto/customer-dto.interface';

export interface CustomerUpdateEvent {
  id: string;
  customer: CustomerDTO;
}
