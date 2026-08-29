"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logChannels = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const token = process.env.DISCORD_TOKEN || process.env.TOKEN || '';
let autoClientId = '';
if (token && token.includes('.')) {
    try {
        autoClientId = Buffer.from(token.split('.')[0], 'base64').toString('utf8');
    }
    catch (e) {
        // ignore
    }
}
exports.config = {
    token,
    clientId: process.env.DISCORD_CLIENT_ID || process.env.CLIENT_ID || autoClientId,
    guildId: process.env.DISCORD_GUILD_ID || process.env.GUILD_ID || '',
    apiPort: parseInt(process.env.API_PORT || '3000'),
    databasePath: process.env.DATABASE_PATH || './data/hoowers.db',
};
exports.logChannels = [
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
