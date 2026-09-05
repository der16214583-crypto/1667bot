import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

const YETKILI_ROL_ID = '1463878100533117066';
const UYE_ROL_ID = '1414500263598755901';
const KAYITSIZ_ROL_ID = '1511719799108010125';

export const data = new SlashCommandBuilder()
  .setName('kayıt')
  .setDescription('Bir kullanıcıya üye rolü verir ve kayıtsız rolünü kaldırır')
  .addUserOption(option =>
    option
      .setName('kullanici')
      .setDescription('Kayıt edilecek kullanıcı')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = await interaction.guild?.members.fetch(interaction.user.id);

  if (!member || !member.roles.cache.has(YETKILI_ROL_ID)) {
    await interaction.reply({
      content: 'Bu komutu kullanmak için yetkin yok.',
      ephemeral: true
    });
    return;
  }

  const user = interaction.options.getUser('kullanici', true);
  const targetMember = await interaction.guild?.members.fetch(user.id).catch(() => null);


  if (!targetMember) {
    await interaction.reply({
      content: 'Kullanıcı sunucuda bulunamadı.',
      ephemeral: true
    });
    return;
  }

  try {
    await targetMember.roles.add(UYE_ROL_ID);

    if (targetMember.roles.cache.has(KAYITSIZ_ROL_ID)) {
      await targetMember.roles.remove(KAYITSIZ_ROL_ID);
    }

    await interaction.reply(
      `✅ ${user} başarıyla kayıt edildi ve kayıtsız rolü kaldırıldı.`
    );

    const { getLogChannel } = require('../utils/channelManager');
    const { sendLog } = require('../utils/logger');
    const logChannel = await getLogChannel(interaction.guild!, 'kayıt-log');
    if (logChannel) {
      await sendLog(
        logChannel,
        '📝 Üye Kayıt Edildi',
        `${interaction.user} yetkilisi tarafından bir üye kayıt edildi.`,
        0x00ff00,
        [
          { name: 'Kayıt Edilen', value: `${user} (${user.id})`, inline: true },
          { name: 'Yetkili', value: `${interaction.user}`, inline: true }
        ]
      );
    }
  } catch (error) {
    await interaction.reply({
      content: 'Rol verilemedi. Bot rolü, Üye ve Kayıtsız rollerinin üstünde olmalı.',
      ephemeral: true
    });
  }
}
