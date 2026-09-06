import { Events, GuildBan } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.GuildBanAdd,
  async execute(ban: GuildBan) {
    try {
      const logChannel = await getLogChannel(ban.guild, 'ban-log');
      if (!logChannel) return;

      const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: 22, // 22 = MEMBER_BAN_ADD
      });
      const banLog = fetchedLogs.entries.first();
      const executor = banLog ? banLog.executor : 'Bilinmiyor';
      const reason = ban.reason || (banLog ? banLog.reason : 'Belirtilmedi');

      await sendLog(
        logChannel,
        '🔨 Üye Yasaklandı',
        `${ban.user.tag} sunucudan yasaklandı.`,
        0xff0000,
        [
          { name: 'Kullanıcı ID', value: ban.user.id, inline: true },
          { name: 'Yasaklayan', value: `${executor}`, inline: true },
          { name: 'Sebep', value: reason || 'Yok', inline: false }
        ]
      );
    } catch (error) {
      console.error('GuildBanAdd event hatası:', error);
    }
  },
};
