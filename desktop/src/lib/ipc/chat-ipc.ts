
import { ipcMain } from 'electron';
import { ChatService } from '../interfaces';

export function registerChatIpcs(chatService: ChatService) {
  ipcMain.handle('get-chat-messages', async () => {
    return chatService.getChatMessages();
  });

  ipcMain.handle('create-chat-message', async (event, dto) => {
    return chatService.createChatMessage(dto);
  });

  ipcMain.handle('update-chat-message', async (event, id, dto) => {
    return chatService.updateChatMessage(id, dto);
  });

  ipcMain.handle('delete-chat-message', async (event, id) => {
    return chatService.deleteChatMessage(id);
  });

  ipcMain.handle('send-message-to-openrouter', async (event, apiKey, messages) => {
    return chatService.sendMessageToOpenRouter(apiKey, messages);
  });
}
