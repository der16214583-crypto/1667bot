"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        try {
            if (!newState.guild)
                return;
            const logChannel = await (0, channelManager_1.getLogChannel)(newState.guild, 'ses-log');
            if (!logChannel)
                return;
            const member = newState.member;
            if (!member)
                return;
            // Odaya Katıldı
            if (!oldState.channelId && newState.channelId) {
                await (0, logger_1.sendLog)(logChannel, '🎤 Ses Kanalına Katıldı', `${member} kullanıcısı **${newState.channel?.name}** kanalına katıldı.`, 0x00ff00, [
                    { name: 'Kullanıcı', value: `${member.user.tag}`, inline: true },
                    { name: 'Kanal', value: `${newState.channel?.name}`, inline: true }
                ]);
            }
            // Odadan Ayrıldı
            else if (oldState.channelId && !newState.channelId) {
                await (0, logger_1.sendLog)(logChannel, '🚪 Ses Kanalından Ayrıldı', `${member} kullanıcısı **${oldState.channel?.name}** kanalından ayrıldı.`, 0xff0000, [
                    { name: 'Kullanıcı', value: `${member.user.tag}`, inline: true },
                    { name: 'Kanal', value: `${oldState.channel?.name}`, inline: true }
                ]);
            }
            // Oda Değiştirdi
            else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
                await (0, logger_1.sendLog)(logChannel, '🔄 Ses Kanalı Değiştirdi', `${member} kullanıcısı kanal değiştirdi.`, 0xffff00, [
                    { name: 'Eski Kanal', value: `${oldState.channel?.name}`, inline: true },
                    { name: 'Yeni Kanal', value: `${newState.channel?.name}`, inline: true }
                ]);
            }
        }
        catch (error) {
            console.error('VoiceStateUpdate event hatası:', error);
        }
    },
};
