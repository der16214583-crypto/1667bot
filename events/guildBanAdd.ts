import { Events, GuildBan } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog, saveLogToDatabase } from '../utils/logger';

export default {
  name: Events.GuildBanAdd,
  async execute(ban: GuildBan) {
    try {
      if (!ban.user) return;
      
      const channel = await getLogChannel(ban.guild, 'ban-log');
      
      await sendLog(
        channel,
        '🔨 Kullanıcı Yasaklandı',
        `${ban.user.tag} sunucudan yasaklandı`,
        0xe74c3c,
        [
          { name: 'Kullanıcı', value: `${ban.user} (${ban.user.id})`, inline: true },
          { name: 'Sebep', value: ban.reason || 'Sebep belirtilmedi', inline: false },
        ]
      );

      saveLogToDatabase(
        'ban-log',
        ban.user.id,
        ban.user.tag,
        'GuildBanAdd',
        JSON.stringify({ reason: ban.reason || null })
      );
    } catch (error) {
      console.error('GuildBanAdd event hatası:', error);
    }
  },
};

