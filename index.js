"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config/config");
const database_1 = require("./database/database");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Event handler'ları yükle
const eventsPath = path.join(__dirname, 'events');
let eventFiles = [];
try {
    eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
}
catch (error) {
    console.error('Events dizini okunamadı:', error);
    process.exit(1);
}
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildBans,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
// Event'leri yükle
for (const file of eventFiles) {
    try {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath).default;
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        }
        else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`Event yüklendi: ${event.name}`);
    }
    catch (error) {
        console.error(`${file} event'i yüklenirken hata:`, error);
    }
}
// Bot'u başlat
if (!config_1.config.token) {
    console.error('HATA: DISCORD_TOKEN .env dosyasında tanımlı değil!');
    process.exit(1);
}
client.login(config_1.config.token).catch((error) => {
    console.error('Bot giriş hatası:', error);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nBot kapatılıyor...');
    await (0, database_1.closeDatabase)();
    client.destroy();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\nBot kapatılıyor...');
    await (0, database_1.closeDatabase)();
    client.destroy();
    process.exit(0);
});
