
import { ChatMessage } from '@prisma/client';

export type CreateChatMessageDto = Omit<ChatMessage, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateChatMessageDto = Partial<CreateChatMessageDto>;
