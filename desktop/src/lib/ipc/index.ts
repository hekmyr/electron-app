import { PrismaClient } from "@prisma/client";
import { registerChatIpcs } from "./chat-ipc";
import { ChatServiceImpl } from "../implementations/chat-service-impl";
import { ChatMessageRepositoryImpl } from "../implementations/chat-message-repository-impl";
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

  const chatMessageRepository = new ChatMessageRepositoryImpl(client);
  const chatService = new ChatServiceImpl(chatMessageRepository);
  registerChatIpcs(chatService);
}
