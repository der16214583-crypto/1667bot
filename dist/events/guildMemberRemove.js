"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.GuildMemberRemove,
    async execute(member) {
        try {
            const logChannel = await (0, channelManager_1.getLogChannel)(member.guild, 'gelen-giden');
            if (logChannel) {
                await (0, logger_1.sendLog)(logChannel, '👋 Üye Ayrıldı', `${member.user.tag} sunucudan ayrıldı. Görüşmek üzere!`, 0xff0000, [
                    { name: 'ID', value: member.id, inline: true },
                    { name: 'Kalan Üye Sayısı', value: `${member.guild.memberCount}`, inline: true }
                ]);
            }
        }
        catch (error) {
            console.error('GuildMemberRemove event hatası:', error);
        }
    },
};
