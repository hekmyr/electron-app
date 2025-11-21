import { VersionService } from "@shared/services/version-service.interface";

export class MockVersionService implements VersionService {
  readonly node = 'mock-node';
  readonly chrome = 'mock-chrome';
  readonly electron = 'mock-electron';
}
