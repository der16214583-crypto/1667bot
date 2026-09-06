"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.MessageDelete,
    async execute(message) {
        try {
            if (!message.guild || message.author?.bot)
                return;
            const logChannel = await (0, channelManager_1.getLogChannel)(message.guild, 'mesaj-log');
            if (!logChannel)
                return;
            await (0, logger_1.sendLog)(logChannel, '🗑️ Mesaj Silindi', `${message.author} tarafından gönderilen bir mesaj silindi.`, 0xff0000, [
                { name: 'Kanal', value: `${message.channel}`, inline: true },
                { name: 'Mesaj İçeriği', value: message.content || '*İçerik Yok Veya Sadece Medya*', inline: false }
            ]);
        }
        catch (error) {
            console.error('MessageDelete event hatası:', error);
        }
    },
};
