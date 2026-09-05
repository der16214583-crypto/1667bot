import { Events, GuildMember } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.GuildMemberUpdate,
  async execute(oldMember: GuildMember, newMember: GuildMember) {
    try {
      // İsim Değiştirme (Nickname)
      if (oldMember.nickname !== newMember.nickname) {
        const logChannel = await getLogChannel(newMember.guild, 'isim-değiştirme-log');
        if (logChannel) {
          await sendLog(
            logChannel,
            '📝 İsim Değiştirildi',
            `${newMember} kullanıcısının sunucu içi ismi değişti.`,
            0xffff00,
            [
              { name: 'Kullanıcı', value: `${newMember.user.tag} (${newMember.id})`, inline: false },
              { name: 'Eski İsim', value: oldMember.nickname || oldMember.user.username, inline: true },
              { name: 'Yeni İsim', value: newMember.nickname || newMember.user.username, inline: true }
            ]
          );
        }
      }

      // Rol Verme / Alma
      if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

        // Audit Log üzerinden işlemi yapanı bulma
        const fetchedLogs = await newMember.guild.fetchAuditLogs({
          limit: 1,
          type: 25, // 25 = MEMBER_ROLE_UPDATE
        });
        const creatorLog = fetchedLogs.entries.first();
        let creator = 'Bilinmiyor';
        if (creatorLog && creatorLog.target?.id === newMember.id) {
          creator = creatorLog.executor?.toString() || 'Bilinmiyor';
        }

        // Rol Verildiyse
        if (addedRoles.size > 0) {
          const logChannel = await getLogChannel(newMember.guild, 'rol-verme-log');
          if (logChannel) {
            const roleText = addedRoles.map(r => `<@&${r.id}>`).join(', ');
            await sendLog(
              logChannel,
              '➕ Rol Verildi',
              `${newMember} kişisine yeni rol eklendi.`,
              0x00ff00,
              [
                { name: 'Yetkili', value: creator, inline: true },
                { name: 'Verilen Rol(ler)', value: roleText, inline: true }
              ]
            );
          }
        }

        // Rol Alındıysa
        if (removedRoles.size > 0) {
          const logChannel = await getLogChannel(newMember.guild, 'rol-alma-log');
          if (logChannel) {
            const roleText = removedRoles.map(r => `<@&${r.id}>`).join(', ');
            await sendLog(
              logChannel,
              '➖ Rol Alındı',
              `${newMember} kişisinden rol alındı.`,
              0xff0000,
              [
                { name: 'Yetkili', value: creator, inline: true },
                { name: 'Alınan Rol(ler)', value: roleText, inline: true }
              ]
            );
          }
        }
      }

    } catch (error) {
      console.error('GuildMemberUpdate event hatası:', error);
    }
  },
};
