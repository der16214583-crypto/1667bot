"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
const database_1 = require("../database/database");
exports.default = {
    name: discord_js_1.Events.ChannelDelete,
    async execute(channel) {
        try {
            if (!(channel instanceof discord_js_1.GuildChannel))
                return;
            if (!channel.guild)
                return;
            const isCategory = channel.type === discord_js_1.ChannelType.GuildCategory;
            const logChannelName = isCategory ? 'kategori-silme' : 'kanal-silme';
            // If the deleted channel itself is one of the log channels, remove its DB entry and stop processing
            const { logChannels } = await Promise.resolve().then(() => __importStar(require('../config/config')));
            if (logChannels.includes(channel.name)) {
                database_1.db.run('DELETE FROM log_channels WHERE channel_name = ?', [channel.name], (err) => {
                    if (err)
                        console.error('Veritabanından log kanalı silinirken hata:', err);
                });
                return;
            }
            // Retrieve log channel from DB or cache
            let logChannel = await (0, channelManager_1.getLogChannel)(channel.guild, logChannelName);
            if (!logChannel) {
                const fallback = channel.guild.channels.cache.find(ch => ch.name === logChannelName && ch.type === discord_js_1.ChannelType.GuildText);
                if (!fallback) {
                    console.warn('Log channel not found for', logChannelName);
                    return;
                }
                logChannel = fallback;
            }
            console.log('ChannelDelete event: processing channel', channel.name, 'logChannelName:', logChannelName);
            // Small delay to allow audit log entry to be created
            await new Promise(res => setTimeout(res, 1000));
            let creator = 'Bilinmiyor';
            try {
                const fetchedLogs = await channel.guild.fetchAuditLogs({
                    limit: 1,
                    type: discord_js_1.AuditLogEvent.ChannelDelete,
                });
                const creatorLog = fetchedLogs.entries.first();
                if (creatorLog && creatorLog.executor) {
                    const executor = creatorLog.executor;
                    // executor may be a User or PartialUser; use tag if available
                    if (executor.tag) {
                        creator = executor.tag;
                    }
                    else if (executor.username) {
                        creator = `${executor.username}#${executor.discriminator ?? ''}`;
                    }
                    else {
                        creator = 'Bilinmiyor';
                    }
                }
            }
            catch (auditErr) {
                console.warn('Audit log fetch hatası (ChannelDelete):', auditErr);
            }
            console.log('Sending delete log to', logChannelName, 'channel ID:', logChannel.id);
            await (0, logger_1.sendLog)(logChannel, isCategory ? '🗑️ Kategori Silindi' : '🗑️ Kanal Silindi', `${creator} tarafından bir ${isCategory ? 'kategori' : 'kanal'} silindi.`, 0xff0000, [
                { name: 'Silinen İsim', value: channel.name, inline: true },
                { name: 'ID', value: channel.id, inline: true },
                { name: 'Silen Kişi', value: `${creator}`, inline: false },
            ]);
        }
        catch (error) {
            console.error('ChannelDelete event hatası:', error);
        }
    },
};
