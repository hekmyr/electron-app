
import { ChatMessage } from '@prisma/client';
import axios from 'axios';

import { ChatMessageRepositoryImpl } from './chat-message-repository-impl';
import { CreateChatMessageDto, UpdateChatMessageDto, ChatService } from '../interfaces';

export class ChatServiceImpl implements ChatService {
  constructor(private readonly repository: ChatMessageRepositoryImpl) {}

  async getChatMessages(): Promise<ChatMessage[]> {
    return this.repository.getChatMessages();
  }

  async createChatMessage(
    dto: CreateChatMessageDto,
  ): Promise<ChatMessage> {
    return this.repository.createChatMessage(dto);
  }

  async updateChatMessage(
    id: string,
    dto: UpdateChatMessageDto,
  ): Promise<ChatMessage> {
    return this.repository.updateChatMessage(id, dto);
  }

  async deleteChatMessage(id: string): Promise<void> {
    return this.repository.deleteChatMessage(id);
  }

  async sendMessageToOpenRouter(
    apiKey: string,
    messages: ChatMessage[],
  ): Promise<ChatMessage> {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gryphe/mythomax-l2-13b',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const botMessage: CreateChatMessageDto = {
      content: response.data.choices[0].message.content,
      role: 'bot',
    };

    return this.repository.createChatMessage(botMessage);
  }
}
