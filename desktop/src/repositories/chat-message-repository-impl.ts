
import { Injectable } from '@nestjs/common';
import { ChatMessage } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import {
  CreateChatMessageDto,
  UpdateChatMessageDto,
} from '../dtos/chat-message-dto.interface';
import { ChatMessageRepository } from './chat-message-repository.interface';

@Injectable()
export class ChatMessageRepositoryImpl implements ChatMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

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
