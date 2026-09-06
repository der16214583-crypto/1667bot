import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

const YETKILI_ROL_ID = '1463878100533117066';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Bir kullanıcıyı sunucudan banlar')
  .addUserOption(option =>
    option.setName('kullanici').setDescription('Banlanacak kullanıcı').setRequired(true)
  )
  .addStringOption(option =>
    option.setName('sebep').setDescription('Ban sebebi').setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = await interaction.guild?.members.fetch(interaction.user.id);

if (!member || !member.roles.cache.has(YETKILI_ROL_ID)) {
    await interaction.reply({ content: 'Bu komutu kullanmak için yetkin yok.', ephemeral: true });
    return;
  }

  const user = interaction.options.getUser('kullanici', true);
  const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

  try {
    await interaction.guild?.members.ban(user.id, { reason });
    await interaction.reply(`✅ ${user.tag} banlandı. Sebep: ${reason}`);
  } catch (error) {
    await interaction.reply({ content: 'Kullanıcı banlanamadı. Botun yetkisini ve rol sırasını kontrol et.', ephemeral: true });
  }
}
