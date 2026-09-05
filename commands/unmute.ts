import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

const YETKILI_ROL_ID = '1463878100533117066';

export const data = new SlashCommandBuilder()
  .setName('unmute')
  .setDescription('Bir kullanıcının timeoutunu kaldırır')
  .addUserOption(option => option.setName('kullanici').setDescription('Timeoutu kaldırılacak kullanıcı').setRequired(true))
  .addStringOption(option => option.setName('sebep').setDescription('Unmute sebebi').setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const executor = await interaction.guild?.members.fetch(interaction.user.id);

    if (!executor || !executor.roles.cache.has(YETKILI_ROL_ID)) {
      await interaction.editReply('Bu komutu kullanmak için yetkin yok.');
      return;
    }

    const user = interaction.options.getUser('kullanici', true);
    const reason = interaction.options.getString('sebep') || 'Timeout kaldırıldı';
    const targetMember = await interaction.guild?.members.fetch(user.id).catch(() => null);

    if (!targetMember) {
      await interaction.editReply('Kullanıcı sunucuda bulunamadı.');
      return;
    }

    if (!targetMember.moderatable) {
      await interaction.editReply('Bu kullanıcının timeoutunu kaldıramıyorum. Bot rolü kullanıcının rolünden üstte olmalı.');
      return;
    }

    await targetMember.timeout(null, reason);
    await interaction.editReply(`✅ ${user} kullanıcısının timeoutu kaldırıldı.\nSebep: ${reason}`);
  } catch (error) {
    console.error('Unmute komutu hatası:', error);
    await interaction.editReply('Unmute işlemi başarısız oldu. Bot yetkisini ve rol sırasını kontrol et.');
  }
}
