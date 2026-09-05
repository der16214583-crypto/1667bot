import { Events, Channel, ChannelType, GuildChannel } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.ChannelCreate,
  async execute(channel: Channel) {
    try {
      if (!(channel instanceof GuildChannel)) return;
      if (!channel.guild) return;

      const isCategory = channel.type === ChannelType.GuildCategory;
      const logChannelName = isCategory ? 'kategori-oluşturma' : 'kanal-oluşturma';

      const logChannel = await getLogChannel(channel.guild, logChannelName);
      if (!logChannel) return;

      // Kategori/Kanal oluşturanı bulmak için Audit Log kullanılabilir (basitlik adına burada genel bilgi veriliyor)
      // Veya delay eklenerek fetchAuditLogs yapılabilir.
      const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: isCategory ? 43 : 10, // 43 = CHANNEL_CREATE, 10 = CHANNEL_CREATE
      });
      const creatorLog = fetchedLogs.entries.first();
      const creator = creatorLog ? creatorLog.executor : 'Bilinmiyor';

      await sendLog(
        logChannel,
        isCategory ? '📁 Kategori Oluşturuldu' : '💬 Kanal Oluşturuldu',
        `${creator} tarafından yeni bir ${isCategory ? 'kategori' : 'kanal'} oluşturuldu.`,
        0x00ff00,
        [
          { name: 'İsim', value: channel.name, inline: true },
          { name: 'ID', value: channel.id, inline: true },
          { name: 'Oluşturan', value: `${creator}`, inline: false }
        ]
      );
    } catch (error) {
      console.error('ChannelCreate event hatası:', error);
    }
  },
};
