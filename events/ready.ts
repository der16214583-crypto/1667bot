import { Client, Events } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import { createLogChannels } from '../utils/channelManager';
import { sendBanAffPanel } from '../utils/banAffPanel';
import { sendMazeretPanel } from '../utils/mazeretPanel';

const VOICE_CHANNEL_ID = '1511779616992526420';

export default {
  name: Events.ClientReady,
  once: true,

  async execute(client: Client) {
    console.log(`Bot hazır! ${client.user?.tag} olarak giriş yapıldı.`);

    await sendBanAffPanel(client);
    await sendMazeretPanel(client);

    const channel = client.channels.cache.get(VOICE_CHANNEL_ID);

    if (channel && channel.isVoiceBased()) {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: true,
      });

      console.log('Bot ses kanalına bağlandı.');
    } else {
      console.log('Ses kanalı bulunamadı.');
    }

    for (const [guildId, guild] of client.guilds.cache) {
      try {
        console.log(`Sunucu kontrol ediliyor: ${guild.name} (${guildId})`);

        const me = guild.members.me;
        if (!me) continue;

        const permissions = me.permissions;
        if (
          !permissions.has('ManageChannels') ||
          !permissions.has('ViewChannel') ||
          !permissions.has('SendMessages')
        ) {
          console.log(`${guild.name} sunucusunda yeterli izin yok!`);
          continue;
        }

        await createLogChannels(guild);
        console.log(`${guild.name} sunucusunda log kanalları hazır!`);
      } catch (error) {
        console.error(`${guild.name} sunucusunda hata:`, error);
      }
    }
  },
};