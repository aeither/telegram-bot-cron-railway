# Telegram Bot + Cron starter (Bun + Hono on Railway)

Ultra-minimal starter: two bot commands (`/start`, `/help`), a cron trigger endpoint, and Hono/Bun server ready for Railway.

## Prerequisites
- Bun `>=1.1`
- Telegram Bot Token
- Railway project with public URL + Cron

## Environment
Create `.env` (see `env.example`):
```
BOT_TOKEN=your-telegram-bot-token
CRON_SECRET=super-secret-string   # For /cron/trigger auth
PORT=3000                         # Optional; Railway sets PORT automatically
```

## Install
```bash
bun install
```

## Run locally
```bash
bun run src/worker.ts
# Webhook:  http://localhost:3000/telegram-webhook
# Cron:     http://localhost:3000/cron/trigger  (POST with Authorization: Bearer $CRON_SECRET)
```

## Test cron trigger (local)
```bash
source .env && curl -X POST http://localhost:3000/cron/trigger \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"test\",\"chatId\":\"${TG_CHAT_ID}\",\"message\":\"Cron test ping\"}"
```

## Deploy to Railway
1) Create a new Railway service from this repo  
2) Set env vars from the list above  
3) Start command: `bun start`  
4) Add a Railway Cron hitting `POST /cron/trigger` with header `Authorization: Bearer $CRON_SECRET`

## Telegram webhook
Point Telegram to your Railway URL:
```bash
curl -X POST "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://<your-railway-domain>/telegram-webhook"}'
```

## Bot commands helper
```bash
bun run scripts/setupBotCommands.ts          # set /start and /help
bun run scripts/setupBotCommands.ts list     # list
bun run scripts/setupBotCommands.ts clear    # clear
bun run scripts/setupBotCommands.ts check    # validate token
```

## Endpoints
- `POST /telegram-webhook` — Telegram webhook handler
- `POST /cron/trigger` — Cron entrypoint (Authorization: `Bearer $CRON_SECRET`)
- `GET /healthz` — health check