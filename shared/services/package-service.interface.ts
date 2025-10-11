import { PackageDTO } from "../dto/package-dto.interface";
import { WithoutId } from "../helper";

export interface PackageService {
  findById: (id: string) => Promise<PackageDTO>;
  deleteById: (id: string) => Promise<void>;
  insert: (pkg: WithoutId<PackageDTO>) => Promise<string>;
  updateById: (id: string, pkg: PackageDTO) => Promise<void>;
}
