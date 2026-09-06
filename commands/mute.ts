import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

const YETKILI_ROL_ID = '1463878100533117066';

export const data = new SlashCommandBuilder()
  .setName('mute')
  .setDescription('Bir kullanıcıya timeout atar')
  .addUserOption(option => option.setName('kullanici').setDescription('Timeout atılacak kullanıcı').setRequired(true))
  .addIntegerOption(option => option.setName('sure').setDescription('Süre dakika olarak').setRequired(true).setMinValue(1).setMaxValue(40320))
  .addStringOption(option => option.setName('sebep').setDescription('Mute sebebi').setRequired(false))
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
    const minutes = interaction.options.getInteger('sure', true);
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
    const targetMember = await interaction.guild?.members.fetch(user.id).catch(() => null);

    if (!targetMember) {
      await interaction.editReply('Kullanıcı sunucuda bulunamadı.');
      return;
    }

    if (!targetMember.moderatable) {
      await interaction.editReply('Bu kullanıcıya timeout atamıyorum. Bot rolü kullanıcının rolünden üstte olmalı.');
      return;
    }

    await targetMember.timeout(minutes * 60 * 1000, reason);
    await interaction.editReply(`✅ ${user} kullanıcısına ${minutes} dakika timeout atıldı.\nSebep: ${reason}`);
  } catch (error) {
    console.error('Mute komutu hatası:', error);
    await interaction.editReply('Mute işlemi başarısız oldu. Bot yetkisini ve rol sırasını kontrol et.');
  }
}
