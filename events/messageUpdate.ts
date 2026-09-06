import { Events, Message } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog } from '../utils/logger';

export default {
  name: Events.MessageUpdate,
  async execute(oldMessage: Message, newMessage: Message) {
    try {
      if (!oldMessage.guild || oldMessage.author?.bot) return;
      if (oldMessage.content === newMessage.content) return; // Sadece embed değişimi gibi durumlarda tetiklenmemesi için

      const logChannel = await getLogChannel(oldMessage.guild, 'mesaj-log');
      if (!logChannel) return;

      await sendLog(
        logChannel,
        '✏️ Mesaj Düzenlendi',
        `${oldMessage.author} tarafından bir mesaj düzenlendi.`,
        0xffff00,
        [
          { name: 'Kanal', value: `${oldMessage.channel}`, inline: true },
          { name: 'Mesaja Git', value: `[Tıkla](${newMessage.url})`, inline: true },
          { name: 'Eski İçerik', value: oldMessage.content || '*Yok*', inline: false },
          { name: 'Yeni İçerik', value: newMessage.content || '*Yok*', inline: false }
        ]
      );
    } catch (error) {
      console.error('MessageUpdate event hatası:', error);
    }
  },
};
