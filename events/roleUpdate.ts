import { Events, Role } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.GuildRoleUpdate,
  async execute(oldRole: Role, newRole: Role) {
    try {
      if (oldRole.name === newRole.name && oldRole.permissions.bitfield === newRole.permissions.bitfield && oldRole.color === newRole.color) {
        return; // Anlamlı bir değişiklik yoksa çık
      }

      const logChannel = await getLogChannel(newRole.guild, 'rol-güncelleme');
      if (!logChannel) return;

      const fetchedLogs = await newRole.guild.fetchAuditLogs({
        limit: 1,
        type: 31, // 31 = ROLE_UPDATE
      });
      const creatorLog = fetchedLogs.entries.first();
      const creator = creatorLog ? creatorLog.executor : 'Bilinmiyor';

      let changes = '';
      if (oldRole.name !== newRole.name) changes += `\n**İsim:** ${oldRole.name} ➡️ ${newRole.name}`;
      if (oldRole.color !== newRole.color) changes += `\n**Renk:** ${oldRole.hexColor} ➡️ ${newRole.hexColor}`;

      await sendLog(
        logChannel,
        '✏️ Rol Güncellendi',
        `${creator} tarafından **${newRole.name}** rolü güncellendi.${changes}`,
        0xffff00,
        [
          { name: 'Güncelleyen', value: `${creator}`, inline: true },
          { name: 'Rol', value: `${newRole}`, inline: true }
        ]
      );
    } catch (error) {
      console.error('RoleUpdate event hatası:', error);
    }
  },
};
