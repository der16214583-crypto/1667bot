"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogChannels = createLogChannels;
exports.getLogChannel = getLogChannel;
const discord_js_1 = require("discord.js");
const config_1 = require("../config/config");
const database_1 = require("../database/database");
async function createLogChannels(guild) {
    const createdChannels = new Map();
    for (const channelName of config_1.logChannels) {
        try {
            // Kanal zaten var mı kontrol et
            const existingChannel = guild.channels.cache.find((ch) => ch.name === channelName && ch.type === discord_js_1.ChannelType.GuildText);
            if (existingChannel) {
                console.log(`Kanal zaten mevcut: ${channelName}`);
                createdChannels.set(channelName, existingChannel);
                // Veritabanına kaydet
                database_1.db.run('INSERT OR IGNORE INTO log_channels (channel_id, channel_name) VALUES (?, ?)', [existingChannel.id, channelName], (err) => {
                    if (err) {
                        console.error(`Veritabanına kaydedilirken hata (${channelName}):`, err);
                    }
                });
                continue;
            }
            // Bot'un ID'sini kontrol et
            const botMember = guild.members.me;
            if (!botMember) {
                console.error(`Bot üyesi bulunamadı: ${channelName}`);
                continue;
            }
            // Kanal oluştur
            const channel = await guild.channels.create({
                name: channelName,
                type: discord_js_1.ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: guild.id, // @everyone
                        deny: ['ViewChannel'], // Herkes göremesin
                    },
                    {
                        id: botMember.id, // Bot
                        allow: ['ViewChannel', 'SendMessages', 'EmbedLinks', 'AttachFiles'],
                    },
                ],
                reason: 'Log kanalı otomatik oluşturuldu',
            });
            console.log(`Log kanalı oluşturuldu: ${channelName}`);
            createdChannels.set(channelName, channel);
            // Veritabanına kaydet
            database_1.db.run('INSERT OR REPLACE INTO log_channels (channel_id, channel_name) VALUES (?, ?)', [channel.id, channelName], (err) => {
                if (err) {
                    console.error(`Veritabanına kaydedilirken hata (${channelName}):`, err);
                }
            });
        }
        catch (error) {
            console.error(`${channelName} kanalı oluşturulurken hata:`, error);
        }
    }
    return createdChannels;
}
async function getLogChannel(guild, channelName) {
    return new Promise((resolve) => {
        database_1.db.get('SELECT channel_id FROM log_channels WHERE channel_name = ?', [channelName], (err, row) => {
            if (err || !row) {
                // Veritabanında yoksa cache'den bul
                const channel = guild.channels.cache.find((ch) => ch.name === channelName && ch.type === discord_js_1.ChannelType.GuildText);
                resolve(channel || null);
            }
            else {
                const channel = guild.channels.cache.get(row.channel_id);
                resolve(channel || null);
            }
        });
    });
}
