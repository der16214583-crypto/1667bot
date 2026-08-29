"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.MessageCreate,
    async execute(message) {
        try {
            if (message.author.bot)
                return;
            if (!message.guild)
                return;
            if (!(message.channel instanceof discord_js_1.TextChannel))
                return;
            // MD kontrolü (küfür, spam vb.)
            const badWords = ['spam', 'test']; // Örnek kelimeler, genişletilebilir
            const content = message.content ? message.content.toLowerCase() : '';
            if (badWords.some(word => content.includes(word))) {
                const channel = await (0, channelManager_1.getLogChannel)(message.guild, 'md-kontrol');
                await (0, logger_1.sendLog)(channel, '⚠️ Şüpheli Mesaj', 'Bir mesaj şüpheli içerik tespit edildi', 0xff0000, [
                    { name: 'Kullanıcı', value: `${message.author} (${message.author.id})`, inline: true },
                    { name: 'Kanal', value: `${message.channel}`, inline: true },
                    { name: 'Mesaj', value: message.content ? message.content.substring(0, 1000) : '*İçerik yok*', inline: false },
                    { name: 'Mesaj Linki', value: message.url, inline: false },
                ]);
                (0, logger_1.saveLogToDatabase)('md-kontrol', message.author.id, message.author.tag, 'SuspiciousMessage', JSON.stringify({
                    channelId: message.channel.id,
                    channelName: message.channel.name,
                    content: message.content ? message.content.substring(0, 500) : '',
                    url: message.url,
                }));
            }
        }
        catch (error) {
            console.error('MessageCreate event hatası:', error);
        }
    },
};
