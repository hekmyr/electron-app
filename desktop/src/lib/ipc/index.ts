import { PrismaClient } from "@prisma/client";
import AddressIpc from "./address-ipc";
import CustomerIpc from "./customer-ipc";
import DeliveryIpc from "./delivery-ipc";
import PackageIpc from "./package-ipc";
import ReturnIpc from "./return-ipc";

export function registerIpcs(client: PrismaClient) {
  const customerIpc = new CustomerIpc(client);
  const addressIpc = new AddressIpc(client);
  const packageIpc = new PackageIpc(client);
  const deliveryIpc = new DeliveryIpc(client);
  const returnIpc = new ReturnIpc(client);

  customerIpc.register();
  addressIpc.register();
  packageIpc.register();
  deliveryIpc.register();
  returnIpc.register();
}
