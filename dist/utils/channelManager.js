"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogChannels = createLogChannels;
exports.getLogChannel = getLogChannel;
const discord_js_1 = require("discord.js");
const config_1 = require("../config/config");
const database_1 = require("../database/database");
async function createLogChannels(guild) {
    const createdChannels = new Map();
    const botMember = guild.members.me;
    if (!botMember) {
        console.error('Bot üyesi bulunamadı, kanal izinleri ayarlanamıyor');
        return createdChannels;
    }
    // İlk önce LOGLAR adında bir kategori varsa, ama doğru tipte değilse (ör. metin kanalı) sil
    const existingLog = guild.channels.cache.find((c) => c.name.toUpperCase() === 'LOGLAR');
    if (existingLog && existingLog.type !== discord_js_1.ChannelType.GuildCategory) {
        try {
            await existingLog.delete('Yanlış tipte LOGLAR kanalı siliniyor');
        }
        catch (e) {
            console.error('Eski LOGLAR kanalı silinirken hata:', e);
        }
    }
    // Şimdi sadece kategori tipindeki LOGLAR'ı bul
    let logCategory = guild.channels.cache.find((c) => c.name.toUpperCase() === 'LOGLAR' && c.type === discord_js_1.ChannelType.GuildCategory);
    if (!logCategory) {
        try {
            const created = await guild.channels.create({
                name: 'LOGLAR',
                type: discord_js_1.ChannelType.GuildCategory,
                permissionOverwrites: [
                    { id: guild.id, deny: [discord_js_1.PermissionFlagsBits.ViewChannel] },
                    { id: botMember.id, allow: [discord_js_1.PermissionFlagsBits.ViewChannel, discord_js_1.PermissionFlagsBits.SendMessages, discord_js_1.PermissionFlagsBits.EmbedLinks, discord_js_1.PermissionFlagsBits.AttachFiles] },
                    ...guild.roles.cache.filter(r => r.permissions.has(discord_js_1.PermissionFlagsBits.Administrator)).map(r => ({ id: r.id, allow: [discord_js_1.PermissionFlagsBits.ViewChannel] }))
                ],
                reason: 'Log kanalları için kategori otomatik oluşturuldu'
            });
            // Fetch the channel to ensure it's fully cached and of correct type
            logCategory = (await guild.channels.fetch(created.id));
            console.log('LOGLAR kategorisi oluşturuldu.');
        }
        catch (error) {
            console.error('Kategori oluşturulurken hata:', error);
            return createdChannels;
        }
    }
    for (const channelName of config_1.logChannels) {
        try {
            // Kanal zaten var mı kontrol et
            const existingChannel = guild.channels.cache.find((ch) => ch.name === channelName && ch.type === discord_js_1.ChannelType.GuildText);
            if (existingChannel) {
                // Delete existing (possibly hidden) channel before recreating
                try {
                    await existingChannel.delete('Recreating log channel to fix permissions');
                }
                catch (delErr) {
                    console.error(`Failed to delete existing ${channelName} channel:`, delErr);
                }
            }
            // Kanal oluştur
            const channel = await guild.channels.create({
                name: channelName,
                type: discord_js_1.ChannelType.GuildText,
                // Only set parent if we have a valid category
                ...(logCategory && logCategory.type === discord_js_1.ChannelType.GuildCategory ? { parent: logCategory.id } : {}),
                permissionOverwrites: [
                    { id: guild.id, deny: [discord_js_1.PermissionFlagsBits.ViewChannel] },
                    { id: botMember.id, allow: [discord_js_1.PermissionFlagsBits.ViewChannel, discord_js_1.PermissionFlagsBits.SendMessages, discord_js_1.PermissionFlagsBits.EmbedLinks, discord_js_1.PermissionFlagsBits.AttachFiles] },
                    ...guild.roles.cache.filter(r => r.permissions.has(discord_js_1.PermissionFlagsBits.Administrator)).map(r => ({ id: r.id, allow: [discord_js_1.PermissionFlagsBits.ViewChannel] }))
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
