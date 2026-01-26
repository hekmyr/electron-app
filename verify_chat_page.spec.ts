
import { test, expect, _electron as electron } from '@playwright/test';

test('Chat page verification', async () => {
  const electronApp = await electron.launch({
    args: ['dist/desktop/src/main.js'],
  });

  const window = await electronApp.firstWindow();

  await window.waitForTimeout(5000);

  await window.screenshot({ path: 'chat-page-screenshot.png' });

  await electronApp.close();
});
