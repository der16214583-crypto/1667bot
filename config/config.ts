import dotenv from 'dotenv';

dotenv.config();

const token = process.env.DISCORD_TOKEN || process.env.TOKEN || '';
let autoClientId = '';
if (token && token.includes('.')) {
  try {
    autoClientId = Buffer.from(token.split('.')[0], 'base64').toString('utf8');
  } catch (e) {
    // ignore
  }
}

export const config = {
  token,
  clientId: process.env.DISCORD_CLIENT_ID || process.env.CLIENT_ID || autoClientId,
  guildId: process.env.DISCORD_GUILD_ID || process.env.GUILD_ID || '',
  apiPort: parseInt(process.env.API_PORT || '3000'),
  databasePath: process.env.DATABASE_PATH || './data/hoowers.db',
};

export const logChannels = [
  'kategori-oluşturma',
  'kategori-silme',
  'kategori-güncelleme',
  'kanal-oluşturma',
  'kanal-silme',
  'kanal-güncelleme',
  'rol-verme-alma',
  'ban',
  'kick',
  'davet-kodu',
  'rol-oluşturma',
  'rol-silme',
  'rol-güncelleme',
  'bot-ekleme',
  'gelen-giden',
  'güvenlik-log',
  'blacklist-log',
  'davet-log',
  'ses-log',
  'küfür-log',
  'reklam-log',
  'rol-verme-log',
  'rol-alma-log',
  'ticket-log',
  'ban-log',
  'kick-log',
  'kayıt-log',
  'mesaj-log',
  'spam-log',
  'isim-değiştirme-log',
  'bot-komut'
];