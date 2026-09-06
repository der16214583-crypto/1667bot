"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.GuildBanRemove,
    async execute(ban) {
        try {
            const logChannel = await (0, channelManager_1.getLogChannel)(ban.guild, 'ban-log');
            if (!logChannel)
                return;
            const fetchedLogs = await ban.guild.fetchAuditLogs({
                limit: 1,
                type: 23, // 23 = MEMBER_BAN_REMOVE
            });
            const banLog = fetchedLogs.entries.first();
            const executor = banLog ? banLog.executor : 'Bilinmiyor';
            await (0, logger_1.sendLog)(logChannel, '🔓 Üye Yasağı Kaldırıldı', `${ban.user.tag} kullanıcısının yasağı kaldırıldı.`, 0x00ff00, [
                { name: 'Kullanıcı ID', value: ban.user.id, inline: true },
                { name: 'Kaldıran', value: `${executor}`, inline: true }
            ]);
        }
        catch (error) {
            console.error('GuildBanRemove event hatası:', error);
        }
    },
};
