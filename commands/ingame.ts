import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ingame')
  .setDescription('Butonlu ingame çağrısı gönderir')
  .addStringOption(option =>
    option
      .setName('mesaj')
      .setDescription('Çağrı mesajı')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  const mesaj = interaction.options.getString('mesaj', true);

  const embed = new EmbedBuilder()
    .setTitle('📢 Ingame Çağrısı')
    .setDescription(`${mesaj}\n\n**Gelecekler:**\nHenüz kimse katılmadı.`)
    .setColor(0x2ecc71)
    .setFooter({ text: `Çağıran: ${interaction.user.tag}` })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('ingame_join')
      .setLabel('Katıl')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('ingame_leave')
      .setLabel('Ayrıl')
      .setStyle(ButtonStyle.Danger)
  );

  await interaction.reply({
    embeds: [embed],
    components: [row]
  });
}
