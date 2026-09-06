import { Events, Role } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.GuildRoleCreate,
  async execute(role: Role) {
    try {
      const logChannel = await getLogChannel(role.guild, 'rol-oluşturma');
      if (!logChannel) return;

      const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: 30, // 30 = ROLE_CREATE
      });
      const creatorLog = fetchedLogs.entries.first();
      const creator = creatorLog ? creatorLog.executor : 'Bilinmiyor';

      await sendLog(
        logChannel,
        '🛡️ Yeni Rol Oluşturuldu',
        `${creator} tarafından sunucuda yeni bir rol oluşturuldu.`,
        0x00ff00,
        [
          { name: 'Rol İsmi', value: role.name, inline: true },
          { name: 'Oluşturan Kişi', value: `${creator}`, inline: true }
        ]
      );
    } catch (error) {
      console.error('RoleCreate event hatası:', error);
    }
  },
};
