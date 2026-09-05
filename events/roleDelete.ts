import { Events, Role } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.GuildRoleDelete,
  async execute(role: Role) {
    try {
      const logChannel = await getLogChannel(role.guild, 'rol-silme');
      if (!logChannel) return;

      const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: 32, // 32 = ROLE_DELETE
      });
      const creatorLog = fetchedLogs.entries.first();
      const creator = creatorLog ? creatorLog.executor : 'Bilinmiyor';

      await sendLog(
        logChannel,
        '🗑️ Rol Silindi',
        `${creator} tarafından sunucuda bir rol silindi.`,
        0xff0000,
        [
          { name: 'Silinen Rol İsmi', value: role.name, inline: true },
          { name: 'Silen Kişi', value: `${creator}`, inline: true }
        ]
      );
    } catch (error) {
      console.error('RoleDelete event hatası:', error);
    }
  },
};
