import { Events, VoiceState } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog, saveLogToDatabase } from '../utils/logger';

export default {
  name: Events.VoiceStateUpdate,
  async execute(oldState: VoiceState, newState: VoiceState) {
    try {
      if (!newState.guild) return;
      
      const member = newState.member || oldState.member;
      if (!member || !member.user || member.user.bot) return;

      const channel = await getLogChannel(newState.guild, 'voice-log');

    // Ses kanalına katılma
    if (!oldState.channel && newState.channel) {
      await sendLog(
        channel,
        '🔊 Ses Kanalına Katıldı',
        `${member.user.tag} ses kanalına katıldı`,
        0x3498db,
        [
          { name: 'Kullanıcı', value: `${member.user} (${member.user.id})`, inline: true },
          { name: 'Kanal', value: `${newState.channel.name}`, inline: true },
        ]
      );

      saveLogToDatabase(
        'voice-log',
        member.user.id,
        member.user.tag,
        'VoiceJoin',
        JSON.stringify({ channelId: newState.channel.id, channelName: newState.channel.name })
      );
    }

    // Ses kanalından ayrılma
    if (oldState.channel && !newState.channel) {
      await sendLog(
        channel,
        '🔇 Ses Kanalından Ayrıldı',
        `${member.user.tag} ses kanalından ayrıldı`,
        0x95a5a6,
        [
          { name: 'Kullanıcı', value: `${member.user} (${member.user.id})`, inline: true },
          { name: 'Kanal', value: `${oldState.channel.name}`, inline: true },
        ]
      );

      saveLogToDatabase(
        'voice-log',
        member.user.id,
        member.user.tag,
        'VoiceLeave',
        JSON.stringify({ channelId: oldState.channel.id, channelName: oldState.channel.name })
      );
    }

    // Ses kanalı değiştirme
    if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
      await sendLog(
        channel,
        '🔄 Ses Kanalı Değiştirdi',
        `${member.user.tag} ses kanalı değiştirdi`,
        0xf39c12,
        [
          { name: 'Kullanıcı', value: `${member.user} (${member.user.id})`, inline: true },
          { name: 'Eski Kanal', value: `${oldState.channel.name}`, inline: true },
          { name: 'Yeni Kanal', value: `${newState.channel.name}`, inline: true },
        ]
      );

      saveLogToDatabase(
        'voice-log',
        member.user.id,
        member.user.tag,
        'VoiceMove',
        JSON.stringify({
          oldChannelId: oldState.channel.id,
          oldChannelName: oldState.channel.name,
          newChannelId: newState.channel.id,
          newChannelName: newState.channel.name,
        })
      );
    }
    } catch (error) {
      console.error('VoiceStateUpdate event hatası:', error);
    }
  },
};

