import { Guild, TextChannel, ChannelType, CategoryChannel } from 'discord.js';
import { logChannels } from '../config/config';
import { db } from '../database/database';

export async function createLogChannels(guild: Guild) {
  const createdChannels: Map<string, TextChannel> = new Map();

  // Sabit kategori ID yerine 'LOGLAR' adıyla kategori bul ya da oluştur
  let logCategory = guild.channels.cache.find(
    (c) => c.name.toUpperCase() === 'LOGLAR' && c.type === ChannelType.GuildCategory
  ) as CategoryChannel | undefined;

  // Yine bulunamazsa, kategori oluştur
  if (!logCategory) {
    try {
      const botMember = guild.members.me;
      if (!botMember) {
        console.error('Bot üyesi bulunamadı, kategori oluşturulamıyor');
        return createdChannels;
      }
      logCategory = await guild.channels.create({
        name: 'LOGLAR',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          { id: guild.id, allow: ['ViewChannel'] },
          { id: botMember.id, allow: ['ViewChannel', 'SendMessages', 'EmbedLinks', 'AttachFiles'] },
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
        console.log(`Kanal zaten mevcut: ${channelName}`);
        createdChannels.set(channelName, existingChannel);
        
        // Veritabanına kaydet
        db.run(
          'INSERT OR IGNORE INTO log_channels (channel_id, channel_name) VALUES (?, ?)',
          [existingChannel.id, channelName],
          (err) => {
            if (err) {
              console.error(`Veritabanına kaydedilirken hata (${channelName}):`, err);
            }
          }
        );
        continue;
      }

      // (Bot id kontrolü yukarı alındı)

      // Kanal oluştur
      const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: logCategory?.id,
        permissionOverwrites: [
          {
            id: guild.id, // @everyone
            allow: ['ViewChannel'], // Herkes görebilsin
          },
          {
            id: botMember!.id, // Bot
            allow: ['ViewChannel', 'SendMessages', 'EmbedLinks', 'AttachFiles'],
          },
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

