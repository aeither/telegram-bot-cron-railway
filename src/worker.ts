import { serve } from 'bun';
import process from 'node:process';
import { Hono } from 'hono';
import { webhookCallback } from 'grammy';
import { createBot } from './bot';
import { buildEnv } from './env';

const env = buildEnv();
const bot = createBot(env);
const honoWebhookHandler = webhookCallback(bot, 'hono');

const app = new Hono();

app.get('/healthz', (c: any) => c.json({ ok: true }));

// Cron trigger endpoint – hit this from Railway Cron
app.post('/cron/trigger', async (c: any) => {
  const auth = c.req.header('Authorization');
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const { action = 'cron', chatId, message } = (await c.req.json().catch(() => ({}))) as {
    action?: string;
    chatId?: number | string;
    message?: string;
  };

  console.log('Cron trigger received:', { action, chatId, message });
  if (chatId) {
    await bot.api.sendMessage(
      Number(chatId),
      message || `Cron executed: ${action}`
    );
  }

  return c.json({ success: true });
});

app.post('/telegram-webhook', honoWebhookHandler);

const port = Number(env.PORT || process.env.PORT || 3000);

serve({
  port,
  fetch: app.fetch,
  async error(error: unknown) {
    console.error('Hono error:', error);
    return new Response('Internal Server Error', { status: 500 });
  },
});

console.log(`Server running on http://localhost:${port}`);

