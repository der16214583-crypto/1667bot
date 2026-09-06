import { Events, Message } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.MessageDelete,
  async execute(message: Message) {
    try {
      if (!message.guild || message.author?.bot) return;

      const logChannel = await getLogChannel(message.guild, 'mesaj-log');
      if (!logChannel) return;

      await sendLog(
        logChannel,
        '🗑️ Mesaj Silindi',
        `${message.author} tarafından gönderilen bir mesaj silindi.`,
        0xff0000,
        [
          { name: 'Kanal', value: `${message.channel}`, inline: true },
          { name: 'Mesaj İçeriği', value: message.content || '*İçerik Yok Veya Sadece Medya*', inline: false }
        ]
      );
    } catch (error) {
      console.error('MessageDelete event hatası:', error);
    }
  },
};
