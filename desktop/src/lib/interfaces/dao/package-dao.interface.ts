export interface PackageDAO {
  id: string;
  name: string;
  description: string;
  status: string;
  receivedAt?: Date;
  deliveredAt?: Date;
  outForDeliveryAt?: Date;
  customerId: string;
  updatedAt: Date;
  createdAt: Date;
}
