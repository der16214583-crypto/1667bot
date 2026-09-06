import { Events, Channel, GuildChannel, ChannelType, AuditLogEvent } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.ChannelUpdate,
  async execute(oldChannel: Channel, newChannel: Channel) {
    try {
      if (!(oldChannel instanceof GuildChannel) || !(newChannel instanceof GuildChannel)) return;
      if (oldChannel.name === newChannel.name) return; // Sadece isim değişikliğini loglayalım şimdilik

      const isCategory = newChannel.type === ChannelType.GuildCategory;
      const logChannelName = isCategory ? 'kategori-güncelleme' : 'kanal-güncelleme';

      const logChannel = await getLogChannel(newChannel.guild, logChannelName);
      if (!logChannel) return;

      const fetchedLogs = await newChannel.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelUpdate
      });
      const creatorLog = fetchedLogs.entries.first();
      const creator = creatorLog ? creatorLog.executor : 'Bilinmiyor';

      await sendLog(
        logChannel,
        isCategory ? '✏️ Kategori Güncellendi' : '✏️ Kanal Güncellendi',
        `${creator} tarafından bir ${isCategory ? 'kategorinin' : 'kanalın'} ismi değiştirildi.`,
        0xffff00,
        [
          { name: 'Eski İsim', value: oldChannel.name, inline: true },
          { name: 'Yeni İsim', value: newChannel.name, inline: true },
          { name: 'Güncelleyen', value: `${creator}`, inline: false }
        ]
      );
    } catch (error) {
      console.error('ChannelUpdate event hatası:', error);
    }
  },
};
