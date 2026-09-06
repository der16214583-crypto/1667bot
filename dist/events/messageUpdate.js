"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        try {
            if (!oldMessage.guild || oldMessage.author?.bot)
                return;
            if (oldMessage.content === newMessage.content)
                return; // Sadece embed değişimi gibi durumlarda tetiklenmemesi için
            const logChannel = await (0, channelManager_1.getLogChannel)(oldMessage.guild, 'mesaj-log');
            if (!logChannel)
                return;
            await (0, logger_1.sendLog)(logChannel, '✏️ Mesaj Düzenlendi', `${oldMessage.author} tarafından bir mesaj düzenlendi.`, 0xffff00, [
                { name: 'Kanal', value: `${oldMessage.channel}`, inline: true },
                { name: 'Mesaja Git', value: `[Tıkla](${newMessage.url})`, inline: true },
                { name: 'Eski İçerik', value: oldMessage.content || '*Yok*', inline: false },
                { name: 'Yeni İçerik', value: newMessage.content || '*Yok*', inline: false }
            ]);
        }
        catch (error) {
            console.error('MessageUpdate event hatası:', error);
        }
    },
};
