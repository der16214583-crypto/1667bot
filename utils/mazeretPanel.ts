import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  ModalBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';

const MAZERET_PANEL_CHANNEL_ID = '1507902327414067270';
const MAZERET_LOG_CHANNEL_ID = '1533943935435538593';

export async function sendMazeretPanel(client: any) {
  const channel = await client.channels.fetch(MAZERET_PANEL_CHANNEL_ID).catch(() => null);

  if (!channel || channel.type !== ChannelType.GuildText) {
    console.log('Mazeret panel kanalı bulunamadı.');
    return;
  }

  const textChannel = channel as TextChannel;

  const messages = await textChannel.messages.fetch({ limit: 20 }).catch(() => null);
  const alreadyExists = messages?.some(msg =>
    msg.author.id === client.user.id &&
    msg.embeds[0]?.title === 'Mazeret Bildirimi'
  );

  if (alreadyExists) {
    console.log('Mazeret paneli zaten var, tekrar gönderilmedi.');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('Mazeret Bildirimi')
    .setDescription('Mazereti olan kişiler aşağıdaki butona basarak mazeretlerini yönetime iletebilir.')
    .setColor(0xf1c40f)
    .setFooter({ text: 'Mazeret Sistemi' })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('mazeret_button')
      .setLabel('Mazeret')
      .setEmoji('📝')
      .setStyle(ButtonStyle.Secondary)
  );

  await textChannel.send({
    embeds: [embed],
    components: [row]
  });

  console.log('Mazeret paneli gönderildi.');
}

export async function handleMazeretButton(interaction: any) {
  const modal = new ModalBuilder()
    .setCustomId('mazeret_modal')
    .setTitle('Mazeret Bildirimi');

  const reason = new TextInputBuilder()
    .setCustomId('mazeret_reason')
    .setLabel('Mazeret sebebi nedir?')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const duration = new TextInputBuilder()
    .setCustomId('mazeret_duration')
    .setLabel('Mazeret süresi ne kadar?')
    .setPlaceholder('Örnek: 1 gün, 3 gün, 1 hafta')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(reason),
    new ActionRowBuilder<TextInputBuilder>().addComponents(duration)
  );

  await interaction.showModal(modal);
}

export async function handleMazeretModal(interaction: any) {
  const reason = interaction.fields.getTextInputValue('mazeret_reason');
  const duration = interaction.fields.getTextInputValue('mazeret_duration');

  const logChannel = await interaction.client.channels.fetch(MAZERET_LOG_CHANNEL_ID).catch(() => null);

  if (!logChannel || logChannel.type !== ChannelType.GuildText) {
    await interaction.reply({
      content: 'Mazeret log kanalı bulunamadı.',
      ephemeral: true
    });
    return;
  }

  const now = new Date();
  const tarih = now.toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const embed = new EmbedBuilder()
    .setTitle('📝 Yeni Mazeret')
    .setColor(0xf1c40f)
    .addFields(
      { name: 'Kullanıcı', value: `${interaction.user} (${interaction.user.id})`, inline: false },
      { name: 'Durum', value: 'MAZERETLİ', inline: true },
      { name: 'Süre', value: duration, inline: true },
      { name: 'Tarih', value: tarih, inline: false },
      { name: 'Mazeret Sebebi', value: reason, inline: false }
    )
    .setFooter({ text: `${interaction.user.username} mazeretli` })
    .setTimestamp();

  await (logChannel as TextChannel).send({
    content: `${interaction.user} mazeret bildirdi.`,
    embeds: [embed]
  });

  await interaction.reply({
    content: '✅ Mazeretin yönetime iletildi.',
    ephemeral: true
  });
}
