import { Events, GuildBan } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.GuildBanRemove,
  async execute(ban: GuildBan) {
    try {
      const logChannel = await getLogChannel(ban.guild, 'ban-log');
      if (!logChannel) return;

      const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: 23, // 23 = MEMBER_BAN_REMOVE
      });
      const banLog = fetchedLogs.entries.first();
      const executor = banLog ? banLog.executor : 'Bilinmiyor';

      await sendLog(
        logChannel,
        '🔓 Üye Yasağı Kaldırıldı',
        `${ban.user.tag} kullanıcısının yasağı kaldırıldı.`,
        0x00ff00,
        [
          { name: 'Kullanıcı ID', value: ban.user.id, inline: true },
          { name: 'Kaldıran', value: `${executor}`, inline: true }
        ]
      );
    } catch (error) {
      console.error('GuildBanRemove event hatası:', error);
    }
  },
};
