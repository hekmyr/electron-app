import { PackageDTO } from "@/shared/dto/package-dto.interface";
import { PackageDAO } from "../dao/package-dao.interface";
import { WithoutId } from "@/shared/helper";

export interface PackageRepository {
  findById: (id: string) => Promise<PackageDAO>;
  findByPage: (limit: number, page?: number) => Promise<PackageDAO[]>;
  deleteById: (id: string) => Promise<void>;
  updateById: (id: string, customer: PackageDTO) => Promise<void>;
  insert: (pkg: WithoutId<PackageDTO>) => Promise<string>;
}
