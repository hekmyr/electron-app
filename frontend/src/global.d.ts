import { ElectronService } from '@/shared/services/electron-service.interface'

export {};

declare global {
  interface Window {
    electron: ElectronService;
  }
}
