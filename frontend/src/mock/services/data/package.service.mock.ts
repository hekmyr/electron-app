import { createMockPackage, createMockPackages } from "@/mock/generate.mock";
import { signal } from "@angular/core";
import { PackageDTO } from "@shared/dto/package-dto.interface";
import { WithoutId } from "@shared/helper";
import { PackageService } from "@shared/services/package-service.interface";

export class MockPackageService implements PackageService {

  private readonly _packagesSignal = signal<PackageDTO[]>(createMockPackages(500));

  findById(id: string) {
    return Promise.resolve(createMockPackage({ id }));
  }
  findbyPage(limit: number, page?: number) {
    const packages = this._packagesSignal();
    return Promise.resolve(packages.slice(0, limit));
  }
  deleteById(id: string) {
    return Promise.resolve();
  }
  insert(pkg: WithoutId<PackageDTO>) {
    return Promise.resolve('mock-id');
  }
  updateById(id: string, pkg: PackageDTO) {
    return Promise.resolve();
  }
}
