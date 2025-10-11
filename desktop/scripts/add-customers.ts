import { CustomerDTO } from "@/shared/dto/customer-dto.interface";
import { WithoutId } from "@/shared/helper";
import { PrismaClient } from "@prisma/client";
import { CustomerRepositoryImpl } from "desktop/src/lib/implementations/repositories/customer-repository-impl";

const client = new PrismaClient();

const customerRepositoyImpl = new CustomerRepositoryImpl(client);
const customers: WithoutId<CustomerDTO>[] = [
  {
    lastName: "Smith",
    firstName: "John",
    birthdate: new Date("1990-01-01"),
    email: "john.smith@example.com"
  },
  {
    lastName: "Doe",
    firstName: "Jane",
    birthdate: new Date("1985-05-15"),
    email: "jane.doe@example.com"
  },
  {
    lastName: "Johnson",
    firstName: "Alice",
    birthdate: new Date("1995-10-20"),
    email: "alice.johnson@example.com"
  },
  {
    lastName: "Brown",
    firstName: "Michael",
    birthdate: new Date("1980-03-10"),
    email: "michael.brown@example.com"
  },
  {
    lastName: "Wilson",
    firstName: "Emily",
    birthdate: new Date("1992-07-25"),
    email: "emily.wilson@example.com"
  }
]

async function insert() {
  for (const customer of customers) {
    await customerRepositoyImpl.insert(customer);
  }
}

insert();
