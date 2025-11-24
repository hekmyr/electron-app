export interface DeliveryDAO {
    id: string;
    status: string;
    scheduledAt: Date;
    createdAt: Date;
    updatedAt: Date;
    customerId: string;
    addressId: string;
}
