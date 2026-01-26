
import { ChatMessage } from '@prisma/client';

import {
  CreateChatMessageDto,
  UpdateChatMessageDto,
} from '../dtos/chat-message-dto.interface';

export abstract class ChatService {
  abstract getChatMessages(): Promise<ChatMessage[]>;
  abstract createChatMessage(
    dto: CreateChatMessageDto,
  ): Promise<ChatMessage>;
  abstract updateChatMessage(
    id: string,
    dto: UpdateChatMessageDto,
  ): Promise<ChatMessage>;
  abstract deleteChatMessage(id: string): Promise<void>;
  abstract sendMessageToOpenRouter(
    apiKey: string,
    messages: ChatMessage[],
  ): Promise<ChatMessage>;
}
