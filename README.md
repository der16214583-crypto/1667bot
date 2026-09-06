# Hoowers Guard Bot

Ayrı çalışan Discord guard botudur.

## Koruma özellikleri

- Kanal silme koruması
- Rol silme koruması
- Webhook koruması
- İzinsiz bot ekleme koruması
- 5 saniyede 3 ban atanı banlama
- Everyone/here spam atanı timeoutlama
- Guard log kanalı

## Kurulum

```bash
npm install
npm run build
npm start
```

`.env.example` dosyasını `.env` yapıp doldur:

```env
DISCORD_TOKEN=guard_bot_token_here
OWNER_ID=senin_discord_id
LOG_CHANNEL_ID=guard_log_kanal_id
GUILD_ID=sunucu_id
```

## Gerekli bot izinleri

- Administrator önerilir
- Ban Members
- Manage Channels
- Manage Roles
- Manage Webhooks
- View Audit Log
- Moderate Members
- View Channels
- Send Messages
