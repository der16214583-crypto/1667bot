import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

const YETKILI_ROL_ID = '1463878100533117066';

export const data = new SlashCommandBuilder()
  .setName('unban')
  .setDescription('ID ile kullanıcının banını kaldırır')
  .addStringOption(option =>
    option
      .setName('id')
      .setDescription('Banı kaldırılacak kullanıcının IDsi')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('sebep')
      .setDescription('Ban kaldırma sebebi')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = await interaction.guild?.members.fetch(interaction.user.id);

  if (!member || !member.roles.cache.has(YETKILI_ROL_ID)) {
    await interaction.reply({ content: 'Bu komutu kullanmak için yetkin yok.', ephemeral: true });
    return;
  }

  const userId = interaction.options.getString('id', true);
  const reason = interaction.options.getString('sebep') || 'Ban kaldırıldı';

  if (!/^\d{17,20}$/.test(userId)) {
    await interaction.reply({ content: 'Geçerli bir kullanıcı ID gir.', ephemeral: true });
    return;
  }

  try {
    await interaction.guild?.members.unban(userId, reason);
    await interaction.reply(`✅ Ban kaldırıldı: \`${userId}\`\nSebep: ${reason}`);
  } catch (error) {
    await interaction.reply({
      content: 'Ban kaldırılamadı. ID yanlış olabilir, kullanıcı banlı olmayabilir veya botun yetkisi yok.',
      ephemeral: true
    });
  }
}
