import { MockElectronService } from "@/mock/electron";
import { Injectable, signal } from "@angular/core";
import { ElectronService } from "@shared/services/electron-service.interface";

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  private _electronService = signal<ElectronService>(new MockElectronService());

  public set electronService(value: ElectronService) {
    this._electronService.set(value);
  }

  public get electronService() {
    return this._electronService();
  }
}
