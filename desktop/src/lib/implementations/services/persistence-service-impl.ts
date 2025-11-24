import { PersistenceService } from "@/shared/services/persistence-service.interface";
import { addressServiceImpl } from "./address-service-impl";
import { customerServiceImpl } from "./customer-service-impl";
import { packageServiceImpl } from "./package-service-impl";
import { deliveryServiceImpl } from "./delivery-service-impl";
import { returnServiceImpl } from "./return-service-impl";

export const persistenceServiceImpl: PersistenceService = {
  customer: customerServiceImpl,
  package: packageServiceImpl,
  address: addressServiceImpl,
  delivery: deliveryServiceImpl,
  return: returnServiceImpl,
};
