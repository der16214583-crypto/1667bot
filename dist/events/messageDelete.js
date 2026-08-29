"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.MessageDelete,
    async execute(message) {
        try {
            if (!message.guild)
                return;
            if (!message.author)
                return;
            if (message.author.bot)
                return;
            if (!(message.channel instanceof discord_js_1.TextChannel))
                return;
            const channel = await (0, channelManager_1.getLogChannel)(message.guild, 'message-log');
            await (0, logger_1.sendLog)(channel, '🗑️ Mesaj Silindi', `Bir mesaj silindi`, 0xe67e22, [
                { name: 'Kullanıcı', value: `${message.author} (${message.author.id})`, inline: true },
                { name: 'Kanal', value: `${message.channel}`, inline: true },
                { name: 'Mesaj', value: message.content || '*İçerik yok*', inline: false },
            ]);
            (0, logger_1.saveLogToDatabase)('message-log', message.author.id, message.author.tag, 'MessageDelete', JSON.stringify({
                channelId: message.channel.id,
                channelName: message.channel.name,
                content: message.content?.substring(0, 500) || ''
            }));
        }
        catch (error) {
            console.error('MessageDelete event hatası:', error);
        }
    },
};
