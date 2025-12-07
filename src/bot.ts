import { Bot, type Context } from 'grammy';
import type { Env } from './env';

export function createBot(env: Env) {
  const bot = new Bot<Context>(env.BOT_TOKEN);

  bot.command('start', async (ctx) => {
    await ctx.reply(
      '👋 Welcome!\n\nThis is a minimal Railway + Bun + Hono Telegram bot starter.\nUse /help to see available commands.'
    );
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(
      'Available commands:\n/start - Welcome message\n/help - This help text'
    );
  });

  bot.on('message', async (ctx) => {
    await ctx.reply('Hi! Use /start or /help.');
  });

  bot.catch((err) => {
    console.error('Bot error:', err);
  });

  return bot;
}
