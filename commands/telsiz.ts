import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';

// Dünkü bot yapına göre: data + execute export
// /telsiz komutunu kullanınca butonlu panel gönderir.

export const data = new SlashCommandBuilder()
  .setName('telsiz')
  .setDescription('Telsiz kodu paneli gönderir')
  .setDefaultMemberPermissions(PermissionFlagsBits.MentionEveryone);

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('📻 Telsiz Kodu Paneli')
    .setDescription('Aşağıdaki butona basınca rastgele telsiz kodu oluşturulur ve @everyone olarak duyurulur.')
    .setColor(0xff0000);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('telsiz_kodu_ver')
      .setLabel('📻 Telsiz Kodu Ver')
      .setStyle(ButtonStyle.Danger)
  );

  await interaction.reply({
    embeds: [embed],
    components: [row]
  });
}
