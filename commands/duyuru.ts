import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder
} from 'discord.js';

const DUYURU_KANAL_ID = '1469847516118777866';

export const data = new SlashCommandBuilder()
  .setName('duyuru')
  .setDescription('Duyuru gönderir')
  .addStringOption(option =>
    option
      .setName('mesaj')
      .setDescription('Duyuru mesajı')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const mesaj = interaction.options.getString('mesaj', true);
  const kanal = await interaction.guild?.channels.fetch(DUYURU_KANAL_ID).catch(() => null);

  if (!kanal || !('send' in kanal)) {
    await interaction.editReply('Duyuru kanalı bulunamadı.');
    return;
  }

  await kanal.send({
    content: `@everyone\n\n📢 **DUYURU**\n\n${mesaj}`
  });

  await interaction.editReply('✅ Duyuru gönderildi.');
}
