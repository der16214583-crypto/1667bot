import { Events, GuildMember } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember) {
    try {
      const logChannel = await getLogChannel(member.guild, 'gelen-giden');
      if (logChannel) {
        await sendLog(
          logChannel,
          '👋 Üye Ayrıldı',
          `${member.user.tag} sunucudan ayrıldı. Görüşmek üzere!`,
          0xff0000,
          [
            { name: 'ID', value: member.id, inline: true },
            { name: 'Kalan Üye Sayısı', value: `${member.guild.memberCount}`, inline: true }
          ]
        );
      }
    } catch (error) {
      console.error('GuildMemberRemove event hatası:', error);
    }
  },
};
