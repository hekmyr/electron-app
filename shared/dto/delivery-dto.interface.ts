export type DeliveryStatus = 'scheduled' | 'in-transit' | 'delivered' | 'failed' | 'cancelled';

export function isDeliveryStatus(status: string): status is DeliveryStatus {
    return ['scheduled', 'in-transit', 'delivered', 'failed', 'cancelled'].includes(status);
}

export interface DeliveryDTO {
    id: string;
    customerId: string;
    status: DeliveryStatus;
    addressId: string;
    packageIds: string[];
    instructions?: string;
    scheduledAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
