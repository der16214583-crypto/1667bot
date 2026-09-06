"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.GuildRoleCreate,
    async execute(role) {
        try {
            const logChannel = await (0, channelManager_1.getLogChannel)(role.guild, 'rol-oluşturma');
            if (!logChannel)
                return;
            const fetchedLogs = await role.guild.fetchAuditLogs({
                limit: 1,
                type: 30, // 30 = ROLE_CREATE
            });
            const creatorLog = fetchedLogs.entries.first();
            const creator = creatorLog ? creatorLog.executor : 'Bilinmiyor';
            await (0, logger_1.sendLog)(logChannel, '🛡️ Yeni Rol Oluşturuldu', `${creator} tarafından sunucuda yeni bir rol oluşturuldu.`, 0x00ff00, [
                { name: 'Rol İsmi', value: role.name, inline: true },
                { name: 'Oluşturan Kişi', value: `${creator}`, inline: true }
            ]);
        }
        catch (error) {
            console.error('RoleCreate event hatası:', error);
        }
    },
};
