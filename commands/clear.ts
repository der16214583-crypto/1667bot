import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Belirtilen miktarda mesaj siler')
  .addIntegerOption(option =>
    option
      .setName('miktar')
      .setDescription('Silinecek mesaj sayısı')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction: ChatInputCommandInteraction) {
  const amount = interaction.options.getInteger('miktar', true);

  if (!interaction.channel || !('bulkDelete' in interaction.channel)) {
    await interaction.reply({ content: 'Bu kanalda mesaj silemem.', ephemeral: true });
    return;
  }

  await interaction.channel.bulkDelete(amount, true);
  await interaction.reply({ content: `${amount} mesaj silindi.`, ephemeral: true });
}
