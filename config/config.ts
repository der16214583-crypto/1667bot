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
  'md-kontrol',
  'ticket-log',
  'security-log',
  'voice-log',
  'ban-log',
  'giris-log',
  'cikis-log',
  'rol-log',
  'message-log',
];