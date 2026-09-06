import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextChannel,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';

const BAN_AFF_PANEL_CHANNEL_ID = '1508836073315500173';
const BAN_AFF_TICKET_CATEGORY_ID = '1511505866942316737';

export async function sendBanAffPanel(client: any) {
  const channel = await client.channels.fetch(BAN_AFF_PANEL_CHANNEL_ID).catch(() => null);

  if (!channel || channel.type !== ChannelType.GuildText) {
    console.log('Ban affı panel kanalı bulunamadı.');
    return;
  }

  const textChannel = channel as TextChannel;

  const messages = await textChannel.messages.fetch({ limit: 20 }).catch(() => null);
  const alreadyExists = messages?.some(msg =>
    msg.author.id === client.user.id &&
    msg.embeds[0]?.title === 'Ban Affı Bekleyenler'
  );

  if (alreadyExists) {
    console.log('Ban affı paneli zaten var, tekrar gönderilmedi.');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('Ban Affı Bekleyenler')
    .setDescription('Ekibimizde banlı olan kişiler için banları daha düzenli tutmak için banları artık buradan gönderiyoruz.')
    .setColor(0xf1c40f)
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('banaff_button')
      .setLabel('Banlıyım!')
      .setEmoji('🖊️')
      .setStyle(ButtonStyle.Secondary)
  );

  await textChannel.send({
    embeds: [embed],
    components: [row]
  });

  console.log('Ban affı paneli gönderildi.');
}

export async function handleBanAffButton(interaction: any) {
  const modal = new ModalBuilder()
    .setCustomId('banaff_modal')
    .setTitle('Ban Affı Başvurusu');

  const reason = new TextInputBuilder()
    .setCustomId('reason')
    .setLabel('Neden banlandın?')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const bannedId = new TextInputBuilder()
    .setCustomId('banned_id')
    .setLabel('Banlı kullanıcı ID')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(reason),
    new ActionRowBuilder<TextInputBuilder>().addComponents(bannedId)
  );

  await interaction.showModal(modal);
}

export async function handleBanAffModal(interaction: any) {
  if (!interaction.guild) return;

  const reason = interaction.fields.getTextInputValue('reason');
  const bannedId = interaction.fields.getTextInputValue('banned_id');

  const safeName = interaction.user.username
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');

  const channelName = `ban-affi-${safeName}`;

  const existing = interaction.guild.channels.cache.find((ch: any) => ch.name === channelName);
  if (existing) {
    await interaction.reply({
      content: `Zaten açık ban affı başvurun var: ${existing}`,
      ephemeral: true
    });
    return;
  }

  const channel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: BAN_AFF_TICKET_CATEGORY_ID,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      }
    ]
  });

  const embed = new EmbedBuilder()
    .setTitle('🖊️ Ban Affı Başvurusu')
    .setColor(0xf1c40f)
    .addFields(
      { name: 'Başvuran', value: `${interaction.user} (${interaction.user.id})`, inline: false },
      { name: 'Banlı Kullanıcı ID', value: bannedId, inline: false },
      { name: 'Neden Banlandın?', value: reason, inline: false }
    )
    .setTimestamp();

  await channel.send({
    content: 'Yeni ban affı başvurusu oluşturuldu.',
    embeds: [embed]
  });

  await interaction.reply({
    content: `✅ Ban affı başvurun oluşturuldu: ${channel}`,
    ephemeral: true
  });
}
