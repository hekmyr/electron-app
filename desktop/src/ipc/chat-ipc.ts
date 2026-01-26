
import { Controller } from '@nestjs/common';
import { IpcHandle } from '@doubledutch/nest-electron';
import { ChatMessage } from '@prisma/client';

import { ChatService } from '../services/chat-service.interface';
import {
  CreateChatMessageDto,
  UpdateChatMessageDto,
} from '../dtos/chat-message-dto.interface';

@Controller()
export class ChatIpc {
  constructor(private readonly chatService: ChatService) {}

  @IpcHandle('get-chat-messages')
  async getChatMessages(): Promise<ChatMessage[]> {
    return this.chatService.getChatMessages();
  }

  @IpcHandle('create-chat-message')
  async createChatMessage(
    dto: CreateChatMessageDto,
  ): Promise<ChatMessage> {
    return this.chatService.createChatMessage(dto);
  }

  @IpcHandle('update-chat-message')
  async updateChatMessage(
    id: string,
    dto: UpdateChatMessageDto,
  ): Promise<ChatMessage> {
    return this.chatService.updateChatMessage(id, dto);
  }

  @IpcHandle('delete-chat-message')
  async deleteChatMessage(id: string): Promise<void> {
    return this.chatService.deleteChatMessage(id);
  }

  @IpcHandle('send-message-to-openrouter')
  async sendMessageToOpenRouter(
    apiKey: string,
    messages: ChatMessage[],
  ): Promise<ChatMessage> {
    return this.chatService.sendMessageToOpenRouter(apiKey, messages);
  }
}
