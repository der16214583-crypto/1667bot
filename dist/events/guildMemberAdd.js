"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.GuildMemberAdd,
    async execute(member) {
        try {
            // Gelen Giden Log (Kullanıcılar İçin)
            const isBot = member.user.bot;
            const logChannelName = 'gelen-giden';
            const logChannel = await (0, channelManager_1.getLogChannel)(member.guild, logChannelName);
            if (logChannel) {
                await (0, logger_1.sendLog)(logChannel, isBot ? '🤖 Yeni Bot Eklendi' : '👋 Yeni Üye Katıldı', `${member} sunucuya katıldı. Hoş geldin!`, 0x00ff00, [
                    { name: 'Hesap Kuruluş', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Üye Sayısı', value: `${member.guild.memberCount}`, inline: true }
                ]);
            }
            // Sadece botlar için ekstra bot-ekleme logu
            if (isBot) {
                const botLogChannel = await (0, channelManager_1.getLogChannel)(member.guild, 'bot-ekleme');
                if (botLogChannel) {
                    const fetchedLogs = await member.guild.fetchAuditLogs({
                        limit: 1,
                        type: 28, // 28 = BOT_ADD
                    });
                    const botLog = fetchedLogs.entries.first();
                    const executor = botLog ? botLog.executor : 'Bilinmiyor';
                    await (0, logger_1.sendLog)(botLogChannel, '🤖 Bot Eklendi', `${executor} sunucuya yeni bir bot ekledi: ${member.user.tag}`, 0xffff00, [
                        { name: 'Ekleyen', value: `${executor}`, inline: true },
                        { name: 'Bot ID', value: member.id, inline: true }
                    ]);
                }
            }
        }
        catch (error) {
            console.error('GuildMemberAdd event hatası:', error);
        }
    },
};
