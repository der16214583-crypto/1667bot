import { Events, Message, TextChannel } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog, saveLogToDatabase } from '../utils/logger';

export default {
  name: Events.MessageDelete,
  async execute(message: Message) {
    try {
      if (!message.guild) return;
      if (!message.author) return;
      if (message.author.bot) return;
      if (!(message.channel instanceof TextChannel)) return;

      const channel = await getLogChannel(message.guild, 'message-log');
      
      await sendLog(
        channel,
        '🗑️ Mesaj Silindi',
        `Bir mesaj silindi`,
        0xe67e22,
        [
          { name: 'Kullanıcı', value: `${message.author} (${message.author.id})`, inline: true },
          { name: 'Kanal', value: `${message.channel}`, inline: true },
          { name: 'Mesaj', value: message.content || '*İçerik yok*', inline: false },
        ]
      );

      saveLogToDatabase(
        'message-log',
        message.author.id,
        message.author.tag,
        'MessageDelete',
        JSON.stringify({ 
          channelId: message.channel.id,
          channelName: message.channel.name,
          content: message.content?.substring(0, 500) || ''
        })
      );
    } catch (error) {
      console.error('MessageDelete event hatası:', error);
    }
  },
};

