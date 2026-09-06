"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.InviteCreate,
    async execute(invite) {
        try {
            if (!invite.guild)
                return;
            const guild = invite.guild;
            const logChannel = await (0, channelManager_1.getLogChannel)(guild, 'davet-kodu');
            if (!logChannel)
                return;
            await (0, logger_1.sendLog)(logChannel, '🔗 Yeni Davet Kodu Oluşturuldu', `${invite.inviter} tarafından yeni bir davet kodu oluşturuldu.`, 0x00ff00, [
                { name: 'Kod', value: invite.code, inline: true },
                { name: 'Kanal', value: `${invite.channel}`, inline: true },
                { name: 'Oluşturan', value: `${invite.inviter}`, inline: false }
            ]);
        }
        catch (error) {
            console.error('InviteCreate event hatası:', error);
        }
    },
};
