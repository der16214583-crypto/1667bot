"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.GuildBanRemove,
    async execute(ban) {
        try {
            if (!ban.user)
                return;
            const channel = await (0, channelManager_1.getLogChannel)(ban.guild, 'ban-log');
            await (0, logger_1.sendLog)(channel, '✅ Yasağı Kaldırıldı', `${ban.user.tag} yasağı kaldırıldı`, 0x2ecc71, [
                { name: 'Kullanıcı', value: `${ban.user} (${ban.user.id})`, inline: true },
            ]);
            (0, logger_1.saveLogToDatabase)('ban-log', ban.user.id, ban.user.tag, 'GuildBanRemove', null);
        }
        catch (error) {
            console.error('GuildBanRemove event hatası:', error);
        }
    },
};
