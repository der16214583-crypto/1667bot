"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.GuildRoleDelete,
    async execute(role) {
        try {
            const logChannel = await (0, channelManager_1.getLogChannel)(role.guild, 'rol-silme');
            if (!logChannel)
                return;
            const fetchedLogs = await role.guild.fetchAuditLogs({
                limit: 1,
                type: 32, // 32 = ROLE_DELETE
            });
            const creatorLog = fetchedLogs.entries.first();
            const creator = creatorLog ? creatorLog.executor : 'Bilinmiyor';
            await (0, logger_1.sendLog)(logChannel, '🗑️ Rol Silindi', `${creator} tarafından sunucuda bir rol silindi.`, 0xff0000, [
                { name: 'Silinen Rol İsmi', value: role.name, inline: true },
                { name: 'Silen Kişi', value: `${creator}`, inline: true }
            ]);
        }
        catch (error) {
            console.error('RoleDelete event hatası:', error);
        }
    },
};
