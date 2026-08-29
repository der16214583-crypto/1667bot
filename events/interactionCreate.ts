import { Events, Interaction, EmbedBuilder } from 'discord.js';

import { execute as pingExecute } from '../commands/ping';
import { execute as yardimExecute } from '../commands/yardim';
import { execute as clearExecute } from '../commands/clear';
import { execute as banExecute } from '../commands/ban';
import { execute as kickExecute } from '../commands/kick';
import { execute as kayitExecute } from '../commands/kayit';
import { execute as ticketExecute } from '../commands/ticket';
import { execute as unbanExecute } from '../commands/unban';
import { execute as dmrolExecute } from '../commands/dmrol';
import { execute as ingameExecute } from '../commands/ingame';
import { execute as fivemExecute } from '../commands/fivem';
import { execute as idbakExecute } from '../commands/idbak';
import { execute as duyuruExecute } from '../commands/duyuru';
import { execute as muteExecute } from '../commands/mute';
import { execute as unmuteExecute } from '../commands/unmute';
import { execute as telsizExecute } from '../commands/telsiz';
import { execute as tagaraExecute } from '../commands/tagara';
import { handleMazeretButton, handleMazeretModal } from '../utils/mazeretPanel';
import { handleBanAffButton, handleBanAffModal } from '../utils/banAffPanel';

import { getLogChannel } from '../utils/channelManager';
import { sendLog, saveLogToDatabase } from '../utils/logger';

function updateIngameEmbed(interaction: Interaction, action: 'join' | 'leave') {
  if (!interaction.isButton()) return null;
  if (!interaction.message.embeds.length) return null;

  const oldEmbed = interaction.message.embeds[0];
  const description = oldEmbed.description ?? "";

  const parts = description.split("**Gelecekler:**");
  const mainMessage = parts[0].trim();

  const users = new Map<string, string>();

  if (parts[1]) {
    const rows = parts[1]
      .split("\n")
      .map(x => x.trim())
      .filter(
        x =>
          x.length &&
          x !== "Henüz kimse katılmadı."
      );

    for (const row of rows) {
      const match = row.match(/<@!?(\d+)>/);

      if (match) {
        users.set(match[1], `<@${match[1]}>`);
      }
    }
  }

  if (action === "join") {
    users.set(interaction.user.id, `<@${interaction.user.id}>`);
  } else {
    users.delete(interaction.user.id);
  }

  const list =
    users.size === 0
      ? "Henüz kimse katılmadı."
      : [...users.values()]
          .map((u, i) => `${i + 1}. ${u}`)
          .join("\n");

  return EmbedBuilder.from(oldEmbed).setDescription(
    `${mainMessage}\n\n**Gelecekler:**\n${list}`
  );
}
export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'ping') return await pingExecute(interaction);
        if (interaction.commandName === 'yardim') return await yardimExecute(interaction);
        if (interaction.commandName === 'clear') return await clearExecute(interaction);
        if (interaction.commandName === 'ban') return await banExecute(interaction);
        if (interaction.commandName === 'kick') return await kickExecute(interaction);
        if (interaction.commandName === 'mute') return await muteExecute(interaction);
        if (interaction.commandName === 'unmute') return await unmuteExecute(interaction);
        if (interaction.commandName === 'kayıt' || interaction.commandName === 'kayit') {
          return await kayitExecute(interaction);
        }
        if (interaction.commandName === 'ticket') return await ticketExecute(interaction);
        if (interaction.commandName === 'unban') return await unbanExecute(interaction);
        if (interaction.commandName === 'dmrol') return await dmrolExecute(interaction);
        if (interaction.commandName === 'ingame') return await ingameExecute(interaction);
        if (interaction.commandName === 'fivem') return await fivemExecute(interaction);
        if (interaction.commandName === 'idbak') return await idbakExecute(interaction);
        if (interaction.commandName === 'duyuru') return await duyuruExecute(interaction);
        if (interaction.commandName === 'telsiz') return await telsizExecute(interaction);
        if (interaction.commandName === 'tagara') return await tagaraExecute(interaction);
        return;
      }

      if (interaction.isButton() && interaction.customId === 'banaff_button') {
        return await handleBanAffButton(interaction);
      }

      if (interaction.isModalSubmit() && interaction.customId === 'banaff_modal') {
        return await handleBanAffModal(interaction);
      }
      if (interaction.isModalSubmit() && interaction.customId === 'mazeret_modal') {
        return await handleMazeretModal(interaction);
      }

      if (interaction.isButton() && interaction.customId === 'ingame_join') {
        const newEmbed = updateIngameEmbed(interaction, 'join');
        if (!newEmbed) return;

        await interaction.update({
          embeds: [newEmbed],
          components: interaction.message.components
        });
        return;
      }

      if (interaction.isButton() && interaction.customId === 'ingame_leave') {
        const newEmbed = updateIngameEmbed(interaction, 'leave');
        if (!newEmbed) return;

        await interaction.update({
          embeds: [newEmbed],
          components: interaction.message.components
        });
        return;
      }


      if (interaction.isButton() && interaction.customId === 'telsiz_kodu_ver') {
        const ilk = Math.floor(Math.random() * 90) + 10;
        const ikinci = Math.floor(Math.random() * 90) + 10;
        const kod = `${ilk}.${ikinci}`;

        await interaction.reply({
          content: `@everyone\n📻 **Yeni Telsiz Kodu:** \`${kod}\``,
          allowedMentions: { parse: ['everyone'] }
        });

        return;
      }

      if (interaction.isButton() && interaction.customId === 'ticket_close') {
        await interaction.reply({ content: 'Ticket 5 saniye içinde kapatılıyor...', ephemeral: true });

        setTimeout(async () => {
          await interaction.channel?.delete().catch(() => null);
        }, 5000);

        return;
      }
      if (interaction.isButton() && interaction.customId === 'mazeret_button') {
           return await handleMazeretButton(interaction);
      }

      if (!interaction.isModalSubmit() && !interaction.isButton()) return;
      if (!interaction.guild) return;

      if (interaction.isModalSubmit() && interaction.customId.startsWith('ticket_')) {
        const channel = await getLogChannel(interaction.guild, 'ticket-log');

        await sendLog(
          channel,
          '🎫 Ticket Oluşturuldu',
          'Yeni bir ticket oluşturuldu',
          0x3498db,
          [
            { name: 'Kullanıcı', value: `${interaction.user} (${interaction.user.id})`, inline: true },
            { name: 'Ticket ID', value: interaction.customId, inline: true },
          ]
        );

        saveLogToDatabase(
          'ticket-log',
          interaction.user.id,
          interaction.user.tag,
          'TicketCreated',
          JSON.stringify({ ticketId: interaction.customId })
        );
      }
    } catch (error) {
      console.error('InteractionCreate event hatası:', error);
    }
  },
};
