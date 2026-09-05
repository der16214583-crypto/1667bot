import { Events, Message, TextChannel, PermissionsBitField } from 'discord.js';
import { getLogChannel } from '../utils/channelManager';
import { sendLog, saveLogToDatabase } from '../utils/logger';

const spamMap = new Map<string, { count: number; timer: NodeJS.Timeout }>();

export default {
  name: Events.MessageCreate,
  async execute(message: Message) {
    try {
      if (message.author.bot) return;
      if (!message.guild) return;
      if (!(message.channel instanceof TextChannel)) return;

      const isAdmin = message.member?.permissions.has(PermissionsBitField.Flags.Administrator);
      if (isAdmin) return; // Yöneticileri denetleme

      const content = message.content ? message.content.toLowerCase() : '';

      // Reklam Kontrolü
      const adLinks = ['discord.gg/', 'discord.com/invite/', 't.me/', 'bit.ly/'];
      if (adLinks.some(link => content.includes(link))) {
        await message.delete().catch(() => {});
        const channel = await getLogChannel(message.guild, 'reklam-log');
        await sendLog(
          channel,
          '🚨 Reklam Engellendi',
          'Bir reklam içeriği silindi',
          0xff0000,
          [
            { name: 'Kullanıcı', value: `${message.author} (${message.author.id})`, inline: true },
            { name: 'Kanal', value: `${message.channel}`, inline: true },
            { name: 'Mesaj İçeriği', value: message.content, inline: false },
          ]
        );
        return;
      }

      // Küfür Kontrolü
      const badWords = ['amk', 'aq', 'oç', 'piç', 'siktir', 'orospu']; // Kapsamlı küfür listesi eklenebilir
      const wordsInMessage = content.split(/\s+/);
      if (wordsInMessage.some(word => badWords.includes(word))) {
        await message.delete().catch(() => {});
        const channel = await getLogChannel(message.guild, 'küfür-log');
        await sendLog(
          channel,
          '🤬 Küfür Engellendi',
          'Bir küfürlü mesaj silindi',
          0xff0000,
          [
            { name: 'Kullanıcı', value: `${message.author} (${message.author.id})`, inline: true },
            { name: 'Kanal', value: `${message.channel}`, inline: true },
            { name: 'Mesaj İçeriği', value: message.content, inline: false },
          ]
        );
        return;
      }

      // Spam Kontrolü
      const authorId = message.author.id;
      const userData = spamMap.get(authorId);

      if (userData) {
        userData.count++;
        if (userData.count >= 5) {
          await message.delete().catch(() => {});
          if (userData.count === 5) { // Sadece bir kez logla
            const channel = await getLogChannel(message.guild, 'spam-log');
            await sendLog(
              channel,
              '⚠️ Spam Algılandı',
              'Bir kullanıcı kısa sürede çok fazla mesaj gönderdi',
              0xffa500,
              [
                { name: 'Kullanıcı', value: `${message.author} (${message.author.id})`, inline: true },
                { name: 'Kanal', value: `${message.channel}`, inline: true },
              ]
            );
          }
        }
      } else {
        spamMap.set(authorId, {
          count: 1,
          timer: setTimeout(() => {
            spamMap.delete(authorId);
          }, 5000) // 5 saniye içinde 5 mesaj = spam
        });
      }

    } catch (error) {
      console.error('MessageCreate event hatası:', error);
    }
  },
};
