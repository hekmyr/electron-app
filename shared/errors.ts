export const errorTypes = [
  "INVALID_ARGUMENT",
  "INTERNAL_ERROR",
  "NOT_FOUND"
] as const;

export type ErrorType = typeof errorTypes[number];

export class AppError extends Error {
  constructor(public type: ErrorType, message: string) {
    super(message);
    this.name = "AppError";
  }
}
