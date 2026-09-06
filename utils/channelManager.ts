import { Guild, TextChannel, ChannelType, CategoryChannel, PermissionFlagsBits } from 'discord.js';
import { logChannels } from '../config/config';
import { db } from '../database/database';

export async function createLogChannels(guild: Guild) {
  const createdChannels: Map<string, TextChannel> = new Map();

  const botMember = guild.members.me;
  if (!botMember) {
    console.error('Bot üyesi bulunamadı, kanal izinleri ayarlanamıyor');
    return createdChannels;
  }

  // Sabit kategori ID yerine 'LOGLAR' adıyla kategori bul ya da oluştur
  let logCategory = guild.channels.cache.find(
    (c) => c.name.toUpperCase() === 'LOGLAR' && c.type === ChannelType.GuildCategory
  ) as CategoryChannel | undefined;

  if (logCategory) {
    try {
      await logCategory.delete('Recreating LOGLAR category');
    } catch (delErr) {
      console.error('Failed to delete existing LOGLAR category:', delErr);
    }
  }

  if (!logCategory) {
    try {
      logCategory = await guild.channels.create({
        name: 'LOGLAR',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          { id: guild.id, allow: [PermissionFlagsBits.ViewChannel] },
          { id: botMember.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles] },
        ],
        reason: 'Log kanalları için kategori otomatik oluşturuldu',
      });
      console.log('LOGLAR kategorisi oluşturuldu.');
    } catch (error) {
      console.error('Kategori oluşturulurken hata:', error);
      return createdChannels;
    }
  }

  for (const channelName of logChannels) {
    try {
      // Kanal zaten var mı kontrol et
      const existingChannel = guild.channels.cache.find(
        (ch) => ch.name === channelName && ch.type === ChannelType.GuildText
      ) as TextChannel | undefined;

      if (existingChannel) {
          // Delete existing (possibly hidden) channel before recreating
          try {
            await existingChannel.delete('Recreating log channel to fix permissions');
          } catch (delErr) {
            console.error(`Failed to delete existing ${channelName} channel:`, delErr);
          }
        }

      // (Bot id kontrolü yukarı alındı)

      // Kanal oluştur
      const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: logCategory?.id,
        permissionOverwrites: [
          // @everyone cannot view
          { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
          // Bot permissions
          { id: botMember!.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles] },
          // Admin roles (any role with Administrator permission) get view permission
          ...guild.roles.cache.filter(r => r.permissions.has(PermissionFlagsBits.Administrator)).map(r => ({ id: r.id, allow: [PermissionFlagsBits.ViewChannel] }))
        ],
        reason: 'Log kanalı otomatik oluşturuldu',
      });

      console.log(`Log kanalı oluşturuldu: ${channelName}`);
      createdChannels.set(channelName, channel);

      // Veritabanına kaydet
      db.run(
        'INSERT OR REPLACE INTO log_channels (channel_id, channel_name) VALUES (?, ?)',
        [channel.id, channelName],
        (err) => {
          if (err) {
            console.error(`Veritabanına kaydedilirken hata (${channelName}):`, err);
          }
        }
      );
    } catch (error) {
      console.error(`${channelName} kanalı oluşturulurken hata:`, error);
    }
  }

  return createdChannels;
}

export async function getLogChannel(guild: Guild, channelName: string): Promise<TextChannel | null> {
  return new Promise((resolve) => {
    db.get(
      'SELECT channel_id FROM log_channels WHERE channel_name = ?',
      [channelName],
      (err, row: any) => {
        if (err || !row) {
          // Veritabanında yoksa cache'den bul
          const channel = guild.channels.cache.find(
            (ch) => ch.name === channelName && ch.type === ChannelType.GuildText
          ) as TextChannel | undefined;
          resolve(channel || null);
        } else {
          const channel = guild.channels.cache.get(row.channel_id) as TextChannel | undefined;
          resolve(channel || null);
        }
      }
    );
  });
}

