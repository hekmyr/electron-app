export interface ReturnDTO {
  id: string;
  packageId: string;
  status: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

export const returnStatus = [
  "pending",
  "approved",
  "rejected",
  "completed",
] as const;

export type ReturnStatus = (typeof returnStatus)[number];

export function isReturnStatus(value: string): value is ReturnStatus {
  return returnStatus.includes(value as ReturnStatus);
}
