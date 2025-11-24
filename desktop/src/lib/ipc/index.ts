import { PrismaClient } from "@prisma/client";
import PackageIpc from "./package-ipc";
import CustomerIpc from "./customer-ipc";
import AddressIpc from "./address-ipc";
import DeliveryIpc from "./delivery-ipc";
import Registrable from "../interfaces/registrable.interface";

export function registerIpcs(client: PrismaClient) {

  const ipcs = [
    new CustomerIpc(client),
    new PackageIpc(client),
    new AddressIpc(client),
    new DeliveryIpc(client)
  ] as Registrable[];

  for (const ipc of ipcs) {
    ipc.register();
  }
}
