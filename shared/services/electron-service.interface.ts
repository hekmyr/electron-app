import { PersistenceService } from "./persistence-service.interface";
import { VersionService } from "./version-service.interface";

export interface ElectronService {
  version: VersionService;
  persistence: PersistenceService;
}
