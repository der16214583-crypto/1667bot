import { Events, Channel, ChannelType, GuildChannel, AuditLogEvent } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.ChannelDelete,
  async execute(channel: Channel) {
    try {
      if (!(channel instanceof GuildChannel)) return;
      if (!channel.guild) return;

      const isCategory = channel.type === ChannelType.GuildCategory;
      const logChannelName = isCategory ? 'kategori-silme' : 'kanal-silme';

      const logChannel = await getLogChannel(channel.guild, logChannelName);
      if (!logChannel) return;

      const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelDelete, // use enum for type safety
      });
      const creatorLog = fetchedLogs.entries.first();
      const creator = creatorLog ? creatorLog.executor : 'Bilinmiyor';

      await sendLog(
        logChannel,
        isCategory ? '🗑️ Kategori Silindi' : '🗑️ Kanal Silindi',
        `${creator} tarafından bir ${isCategory ? 'kategori' : 'kanal'} silindi.`,
        0xff0000,
        [
          { name: 'Silinen İsim', value: channel.name, inline: true },
          { name: 'ID', value: channel.id, inline: true },
          { name: 'Silen Kişi', value: `${creator}`, inline: false }
        ]
      );
    } catch (error) {
      console.error('ChannelDelete event hatası:', error);
    }
  },
};
