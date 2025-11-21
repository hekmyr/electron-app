import { MockService } from "@/shared/mock";
import { inject } from "@angular/core";
import { PackageDTO } from "@shared/dto/package-dto.interface";

export interface PackageService {
    findPackages(limit: number): Map<string, PackageDTO>;
    updatePackage(id: string, pkg: PackageDTO): void;
    createPackage(pkg: PackageDTO): void;
    deletePackage(id: string): void;
}

export class PackageServiceImpl implements PackageService {

    private readonly _mockService: MockService;

    public constructor() {
        this._mockService = inject(MockService);
    }

    public findPackages(limit: number): Map<string, PackageDTO> {
        const packages = this._mockService.findPackages(limit);
        const map = new Map<string, PackageDTO>();
        packages.forEach(pkg => map.set(pkg.id, pkg));
        return map;
    }

    public updatePackage(id: string, pkg: PackageDTO): void {
        // In a real app, this would update the backend
    }

    public createPackage(pkg: PackageDTO): void {
        // In a real app, this would create the package in the backend
    }

    public deletePackage(id: string): void {
        // In a real app, this would delete from the backend
    }
}
