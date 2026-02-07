import { describe, it, expect, beforeAll } from 'bun:test';

describe('Sanity checks', () => {
  beforeAll(() => {
    process.env.BOT_TOKEN = 'test_token';
    process.env.CRON_SECRET = 'test_secret';
  });

  it('should validate environment variables', async () => {
    const { buildEnv } = await import('../src/env');
    const env = buildEnv();
    expect(env.BOT_TOKEN).toBe('test_token');
    expect(env.CRON_SECRET).toBe('test_secret');
  });

  it('should create bot instance', async () => {
    const { buildEnv } = await import('../src/env');
    const { createBot } = await import('../src/bot');
    const env = buildEnv();
    const bot = createBot(env);
    expect(bot).toBeDefined();
  });
});
