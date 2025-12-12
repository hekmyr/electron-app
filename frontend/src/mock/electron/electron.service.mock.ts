import { ElectronService } from "@shared/services/electron-service.interface";
import { MockPersistenceService } from "./persistence.service.mock";

export class MockElectronService implements ElectronService {
  readonly persistence = new MockPersistenceService();
}
