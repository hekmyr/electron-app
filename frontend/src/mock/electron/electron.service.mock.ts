import { ElectronService } from "@shared/services/electron-service.interface";
import { MockVersionService } from "./version.service.mock";
import { MockPersistenceService } from "./persistence.service.mock";

export class MockElectronService implements ElectronService {
  readonly version = new MockVersionService();
  readonly persistence = new MockPersistenceService();
}
