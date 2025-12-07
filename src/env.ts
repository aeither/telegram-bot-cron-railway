import { config } from 'dotenv';

config();

export interface Env {
  BOT_TOKEN: string;
  CRON_SECRET: string;
  PORT?: string;
}

export const REQUIRED_ENV_KEYS: (keyof Env)[] = ['BOT_TOKEN', 'CRON_SECRET'];

export function validateEnv(env: Partial<Env>, required: (keyof Env | string)[] = REQUIRED_ENV_KEYS) {
  const source = env as Record<string, unknown>;
  const missing = required.filter((key) => {
    const value = source[key as string];
    return value === undefined || value === null || value === '';
  });
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export function buildEnv(): Env {
  const env: Partial<Env> = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    CRON_SECRET: process.env.CRON_SECRET,
    PORT: process.env.PORT,
  };

  validateEnv(env);

  return env as Env;
}