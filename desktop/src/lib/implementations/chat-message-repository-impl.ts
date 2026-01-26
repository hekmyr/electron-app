
import { ChatMessage, PrismaClient } from '@prisma/client';
import { CreateChatMessageDto, UpdateChatMessageDto } from '../interfaces';

export class ChatMessageRepositoryImpl {
  constructor(private readonly prisma: PrismaClient) {}

  async getChatMessages(): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany();
  }

  async createChatMessage(
    dto: CreateChatMessageDto,
  ): Promise<ChatMessage> {
    return this.prisma.chatMessage.create({ data: dto });
  }

  async updateChatMessage(
    id: string,
    dto: UpdateChatMessageDto,
  ): Promise<ChatMessage> {
    return this.prisma.chatMessage.update({ where: { id }, data: dto });
  }

  async deleteChatMessage(id: string): Promise<void> {
    await this.prisma.chatMessage.delete({ where: { id } });
  }
}
