import { Events, GuildMember } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    try {
      // Gelen Giden Log (Kullanıcılar İçin)
      const isBot = member.user.bot;
      
      const logChannelName = 'gelen-giden';
      const logChannel = await getLogChannel(member.guild, logChannelName);
      
      if (logChannel) {
        await sendLog(
          logChannel,
          isBot ? '🤖 Yeni Bot Eklendi' : '👋 Yeni Üye Katıldı',
          `${member} sunucuya katıldı. Hoş geldin!`,
          0x00ff00,
          [
            { name: 'Hesap Kuruluş', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
            { name: 'Üye Sayısı', value: `${member.guild.memberCount}`, inline: true }
          ]
        );
      }

      // Sadece botlar için ekstra bot-ekleme logu
      if (isBot) {
        const botLogChannel = await getLogChannel(member.guild, 'bot-ekleme');
        if (botLogChannel) {
          const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 28, // 28 = BOT_ADD
          });
          const botLog = fetchedLogs.entries.first();
          const executor = botLog ? botLog.executor : 'Bilinmiyor';

          await sendLog(
            botLogChannel,
            '🤖 Bot Eklendi',
            `${executor} sunucuya yeni bir bot ekledi: ${member.user.tag}`,
            0xffff00,
            [
              { name: 'Ekleyen', value: `${executor}`, inline: true },
              { name: 'Bot ID', value: member.id, inline: true }
            ]
          );
        }
      }
      
    } catch (error) {
      console.error('GuildMemberAdd event hatası:', error);
    }
  },
};
