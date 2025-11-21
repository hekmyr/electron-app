import { PersistenceService } from "@shared/services/persistence-service.interface";
import { MockCustomerService, MockPackageService } from "../services/data";

export class MockPersistenceService implements PersistenceService {
  readonly customer = new MockCustomerService();
  readonly package = new MockPackageService();
}
