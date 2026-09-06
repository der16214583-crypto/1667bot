"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.GuildBanAdd,
    async execute(ban) {
        try {
            const logChannel = await (0, channelManager_1.getLogChannel)(ban.guild, 'ban-log');
            if (!logChannel)
                return;
            const fetchedLogs = await ban.guild.fetchAuditLogs({
                limit: 1,
                type: 22, // 22 = MEMBER_BAN_ADD
            });
            const banLog = fetchedLogs.entries.first();
            const executor = banLog ? banLog.executor : 'Bilinmiyor';
            const reason = ban.reason || (banLog ? banLog.reason : 'Belirtilmedi');
            await (0, logger_1.sendLog)(logChannel, '🔨 Üye Yasaklandı', `${ban.user.tag} sunucudan yasaklandı.`, 0xff0000, [
                { name: 'Kullanıcı ID', value: ban.user.id, inline: true },
                { name: 'Yasaklayan', value: `${executor}`, inline: true },
                { name: 'Sebep', value: reason || 'Yok', inline: false }
            ]);
        }
        catch (error) {
            console.error('GuildBanAdd event hatası:', error);
        }
    },
};
