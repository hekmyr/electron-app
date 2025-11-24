import { generateMocks } from "@/mock/generate.mock";
import { PersistenceService } from "@shared/services/persistence-service.interface";
import { MockAddressService, MockCustomerService, MockDeliveryService, MockPackageService } from "../services/data";

export class MockPersistenceService implements PersistenceService {
  readonly _mock = generateMocks(50);

  readonly customer = new MockCustomerService(this._mock);
  readonly package = new MockPackageService(this._mock.packages);
  readonly address = new MockAddressService(this._mock.addresses);
  readonly delivery = new MockDeliveryService(this._mock.deliveries);
}
