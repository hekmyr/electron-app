import { VersionService } from '@/shared/services/version-service.interface'

export const versionServiceImpl: VersionService = {
  chrome: process.versions.chrome,
  electron: process.versions.electron,
  node: process.versions.node,
};
