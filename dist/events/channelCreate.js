"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.ChannelCreate,
    async execute(channel) {
        try {
            if (!(channel instanceof discord_js_1.GuildChannel))
                return;
            if (!channel.guild)
                return;
            const isCategory = channel.type === discord_js_1.ChannelType.GuildCategory;
            const logChannelName = isCategory ? 'kategori-oluşturma' : 'kanal-oluşturma';
            const logChannel = await (0, channelManager_1.getLogChannel)(channel.guild, logChannelName);
            if (!logChannel)
                return;
            // Kategori/Kanal oluşturanı bulmak için Audit Log kullanılabilir (basitlik adına burada genel bilgi veriliyor)
            // Veya delay eklenerek fetchAuditLogs yapılabilir.
            const fetchedLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: discord_js_1.AuditLogEvent.ChannelCreate
            });
            const creatorLog = fetchedLogs.entries.first();
            const creator = creatorLog ? creatorLog.executor : 'Bilinmiyor';
            await (0, logger_1.sendLog)(logChannel, isCategory ? '📁 Kategori Oluşturuldu' : '💬 Kanal Oluşturuldu', `${creator} tarafından yeni bir ${isCategory ? 'kategori' : 'kanal'} oluşturuldu.`, 0x00ff00, [
                { name: 'İsim', value: channel.name, inline: true },
                { name: 'ID', value: channel.id, inline: true },
                { name: 'Oluşturan', value: `${creator}`, inline: false }
            ]);
        }
        catch (error) {
            console.error('ChannelCreate event hatası:', error);
        }
    },
};
