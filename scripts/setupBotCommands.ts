import { config } from 'dotenv';
import { buildEnv, validateEnv } from '../src/env';

interface TelegramCommand {
  command: string;
  description: string;
}

function load() {
  config();
  const env = buildEnv();
  validateEnv(env, ['BOT_TOKEN']);
  return env;
}

async function setupBotCommands() {
  const env = load();
  const commands: TelegramCommand[] = [
    { command: 'start', description: 'Welcome message' },
    { command: 'help', description: 'Show help' },
  ];

  const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/setMyCommands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commands }),
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    console.error('❌ Failed to set commands:', result);
    return { success: false, error: result };
  }

  console.log('✅ Commands registered:', commands.map((c) => `/${c.command}`).join(', '));
  return { success: true };
}

async function clearBotCommands() {
  const env = load();
  const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/setMyCommands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commands: [] }),
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    console.error('❌ Failed to clear commands:', result);
    return { success: false, error: result };
  }
  console.log('✅ Commands cleared');
  return { success: true };
}

async function getCurrentCommands() {
  const env = load();
  const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/getMyCommands`);
  const result = await response.json();

  if (!response.ok || !result.ok) {
    console.error('❌ Failed to fetch commands:', result);
    return { success: false, error: result };
  }

  if (result.result.length === 0) {
    console.log('(no commands set)');
  } else {
    result.result.forEach((cmd: TelegramCommand, i: number) =>
      console.log(`${i + 1}. /${cmd.command} - ${cmd.description}`)
    );
  }
  return { success: true };
}

async function checkBotToken() {
  const env = load();
  const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/getMe`);
  const result = await response.json();

  if (!response.ok || !result.ok) {
    console.error('❌ Token test failed:', result);
    return { success: false, error: result };
  }

  console.log(`✅ Token valid. Bot: @${result.result.username} (${result.result.id})`);
  return { success: true, bot: result.result };
}

async function main() {
  const command = process.argv[2] || 'setup';

  switch (command) {
    case 'setup':
    case 'register':
      await setupBotCommands();
      break;
    case 'clear':
      await clearBotCommands();
      break;
    case 'list':
      await getCurrentCommands();
      break;
    case 'check':
    case 'test':
      await checkBotToken();
      break;
    default:
      console.log('Usage: bun run scripts/setupBotCommands.ts [setup|clear|list|check]');
  }
}

main().catch(console.error);
