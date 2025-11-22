import { WithoutId } from "@/shared/helper";
import { CustomerRepository } from "../../interfaces/repositories/customer-repository.interface";
import { PrismaClient } from "@prisma/client";
import { CustomerDTO } from "@/shared/dto/customer-dto.interface";

export class CustomerRepositoryImpl implements CustomerRepository {

  constructor(
    private _client: PrismaClient
  ) { }

  async insert(customer: WithoutId<CustomerDTO>): Promise<string> {
    const result = await this._client.customer.create({
      data: {
        email: customer.email,
        phone: customer.phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
        birthdate: customer.birthdate,
      }
    });
    return result.id;
  }

  async findById(id: string) {
    return this._client.customer.findUnique({
      where: { id }
    });
  }

  async findbyPage(limit: number, page: number = 0) {
    const skip = page * limit;
    return this._client.customer.findMany({
      take: limit,
      skip
    });
  }

  async deleteById(id: string): Promise<void> {
    await this._client.customer.delete({
      where: { id }
    });
  }

  async updateById(id: string, customer: CustomerDTO): Promise<void> {
    await this._client.customer.update({
      where: { id },
      data: {
        email: customer.email,
        phone: customer.phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
        birthdate: customer.birthdate,
      }
    });
  }
}
