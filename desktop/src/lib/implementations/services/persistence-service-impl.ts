import { PersistenceService } from "@/shared/services/persistence-service.interface";
import { customerServiceImpl } from "./customer-service-impl";
import { packageServiceImpl } from "./package-service-impl";

export const persistenceServiceImpl: PersistenceService = {
  customer: customerServiceImpl,
  package: packageServiceImpl,
};
