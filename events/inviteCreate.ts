import { Events, Invite } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.InviteCreate,
  async execute(invite: Invite) {
    try {
      if (!invite.guild) return;

      const logChannel = await getLogChannel(invite.guild, 'davet-kodu');
      if (!logChannel) return;

      await sendLog(
        logChannel,
        '🔗 Yeni Davet Kodu Oluşturuldu',
        `${invite.inviter} tarafından yeni bir davet kodu oluşturuldu.`,
        0x00ff00,
        [
          { name: 'Kod', value: invite.code, inline: true },
          { name: 'Kanal', value: `${invite.channel}`, inline: true },
          { name: 'Oluşturan', value: `${invite.inviter}`, inline: false }
        ]
      );
    } catch (error) {
      console.error('InviteCreate event hatası:', error);
    }
  },
};
