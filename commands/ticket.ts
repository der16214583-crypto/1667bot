import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder
} from 'discord.js';

const TICKET_CATEGORY_ID = '1511365886903062698';

export const data = new SlashCommandBuilder()
  .setName('ticket')
  .setDescription('Ticket oluşturur');

export async function execute(interaction: ChatInputCommandInteraction) {
  const guild = interaction.guild;
  if (!guild) return;

  const channelName = `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, '');

  const existing = guild.channels.cache.find(ch => ch.name === channelName);
  if (existing) {
    await interaction.reply({ content: `Zaten açık ticketın var: ${existing}`, ephemeral: true });
    return;
  }

  try {
    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: TICKET_CATEGORY_ID,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
      ],
    });

    const closeButton = new ButtonBuilder()
      .setCustomId('ticket_close')
      .setLabel('Ticket Kapat')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton);

    await channel.send({
      content: `${interaction.user} ticket oluşturdu. Yetkililer birazdan ilgilenecek.`,
      components: [row],
    });

    await interaction.reply({ content: `✅ Ticket oluşturuldu: ${channel}`, ephemeral: true });
  } catch (error) {
    await interaction.reply({ content: 'Ticket oluşturulamadı. Kategori ID veya bot yetkilerini kontrol et.', ephemeral: true });
  }
}
