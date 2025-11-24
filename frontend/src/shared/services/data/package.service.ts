import { PackageDTO } from "@shared/dto/package-dto.interface";
import * as SharedServices from '@shared/services';

export interface PackageService {
    findPackages(limit: number): Promise<Map<string, PackageDTO>>;
    updatePackage(id: string, pkg: PackageDTO): Promise<void>;
    createPackage(pkg: PackageDTO): Promise<void>;
    deletePackage(id: string): Promise<void>;
}

export class PackageServiceImpl implements PackageService {

  public constructor(
    private _packageService: SharedServices.PackageService
  ) {}

    public async findPackages(limit: number) {
        const packages = await this._packageService.findbyPage(limit);
        const map = new Map<string, PackageDTO>();
        packages.forEach(pkg => map.set(pkg.id, pkg));
        return map;
    }

    public async updatePackage(id: string, pkg: PackageDTO) {
        await this._packageService.updateById(id, pkg);
    }

    public async createPackage(pkg: PackageDTO) {
         await this._packageService.insert(pkg);
    }

    public async deletePackage(id: string) {
        await this._packageService.deleteById(id);
    }
}
