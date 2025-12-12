import { ElectronService } from '@/shared/services/electron-service.interface'
import { persistenceServiceImpl } from './persistence-service-impl'

export const electronServiceImpl: ElectronService = {
  persistence: persistenceServiceImpl,
}
