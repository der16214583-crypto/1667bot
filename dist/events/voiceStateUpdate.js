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
            const member = newState.member || oldState.member;
            if (!member || !member.user || member.user.bot)
                return;
            const channel = await (0, channelManager_1.getLogChannel)(newState.guild, 'voice-log');
            // Ses kanalına katılma
            if (!oldState.channel && newState.channel) {
                await (0, logger_1.sendLog)(channel, '🔊 Ses Kanalına Katıldı', `${member.user.tag} ses kanalına katıldı`, 0x3498db, [
                    { name: 'Kullanıcı', value: `${member.user} (${member.user.id})`, inline: true },
                    { name: 'Kanal', value: `${newState.channel.name}`, inline: true },
                ]);
                (0, logger_1.saveLogToDatabase)('voice-log', member.user.id, member.user.tag, 'VoiceJoin', JSON.stringify({ channelId: newState.channel.id, channelName: newState.channel.name }));
            }
            // Ses kanalından ayrılma
            if (oldState.channel && !newState.channel) {
                await (0, logger_1.sendLog)(channel, '🔇 Ses Kanalından Ayrıldı', `${member.user.tag} ses kanalından ayrıldı`, 0x95a5a6, [
                    { name: 'Kullanıcı', value: `${member.user} (${member.user.id})`, inline: true },
                    { name: 'Kanal', value: `${oldState.channel.name}`, inline: true },
                ]);
                (0, logger_1.saveLogToDatabase)('voice-log', member.user.id, member.user.tag, 'VoiceLeave', JSON.stringify({ channelId: oldState.channel.id, channelName: oldState.channel.name }));
            }
            // Ses kanalı değiştirme
            if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
                await (0, logger_1.sendLog)(channel, '🔄 Ses Kanalı Değiştirdi', `${member.user.tag} ses kanalı değiştirdi`, 0xf39c12, [
                    { name: 'Kullanıcı', value: `${member.user} (${member.user.id})`, inline: true },
                    { name: 'Eski Kanal', value: `${oldState.channel.name}`, inline: true },
                    { name: 'Yeni Kanal', value: `${newState.channel.name}`, inline: true },
                ]);
                (0, logger_1.saveLogToDatabase)('voice-log', member.user.id, member.user.tag, 'VoiceMove', JSON.stringify({
                    oldChannelId: oldState.channel.id,
                    oldChannelName: oldState.channel.name,
                    newChannelId: newState.channel.id,
                    newChannelName: newState.channel.name,
                }));
            }
        }
        catch (error) {
            console.error('VoiceStateUpdate event hatası:', error);
        }
    },
};
