export interface PackageDTO {
  id: string;
  customerId: string;
  name: string;
  description: string;
  status: PackageStatus;
  receivedAt?: Date;
  deliveredAt?: Date;
  outForDeliveryAt?: Date;
  createdAt: Date;
}

export const packageStatus = [
  "received",
  "out_for_delivery",
  "delivered"
] as const;

export type PackageStatus = typeof packageStatus[number];

export function isPackageStatus(value: string): value is PackageStatus {
  return packageStatus.includes(value as PackageStatus);
}
