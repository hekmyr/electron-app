import { contextBridge } from 'electron';
import { electronServiceImpl } from './lib/implementations/services/electron-service-impl';

contextBridge.exposeInMainWorld("electron", electronServiceImpl);
