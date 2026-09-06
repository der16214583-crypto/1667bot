"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        try {
            if (!(oldChannel instanceof discord_js_1.GuildChannel) || !(newChannel instanceof discord_js_1.GuildChannel))
                return;
            if (oldChannel.name === newChannel.name)
                return; // Sadece isim değişikliğini loglayalım şimdilik
            const isCategory = newChannel.type === discord_js_1.ChannelType.GuildCategory;
            const logChannelName = isCategory ? 'kategori-güncelleme' : 'kanal-güncelleme';
            const logChannel = await (0, channelManager_1.getLogChannel)(newChannel.guild, logChannelName);
            if (!logChannel)
                return;
            const fetchedLogs = await newChannel.guild.fetchAuditLogs({
                limit: 1,
                type: discord_js_1.AuditLogEvent.ChannelUpdate
            });
            const creatorLog = fetchedLogs.entries.first();
            const creator = creatorLog ? creatorLog.executor : 'Bilinmiyor';
            await (0, logger_1.sendLog)(logChannel, isCategory ? '✏️ Kategori Güncellendi' : '✏️ Kanal Güncellendi', `${creator} tarafından bir ${isCategory ? 'kategorinin' : 'kanalın'} ismi değiştirildi.`, 0xffff00, [
                { name: 'Eski İsim', value: oldChannel.name, inline: true },
                { name: 'Yeni İsim', value: newChannel.name, inline: true },
                { name: 'Güncelleyen', value: `${creator}`, inline: false }
            ]);
        }
        catch (error) {
            console.error('ChannelUpdate event hatası:', error);
        }
    },
};
