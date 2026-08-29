import { Events, GuildBan } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog, saveLogToDatabase } from '../utils/logger';

export default {
  name: Events.GuildBanRemove,
  async execute(ban: GuildBan) {
    try {
      if (!ban.user) return;
      
      const channel = await getLogChannel(ban.guild, 'ban-log');
      
      await sendLog(
        channel,
        '✅ Yasağı Kaldırıldı',
        `${ban.user.tag} yasağı kaldırıldı`,
        0x2ecc71,
        [
          { name: 'Kullanıcı', value: `${ban.user} (${ban.user.id})`, inline: true },
        ]
      );

      saveLogToDatabase(
        'ban-log',
        ban.user.id,
        ban.user.tag,
        'GuildBanRemove',
        null
      );
    } catch (error) {
      console.error('GuildBanRemove event hatası:', error);
    }
  },
};

