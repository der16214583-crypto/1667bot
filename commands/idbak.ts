import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder
} from 'discord.js';

import {
  getFiveMPlayers,
  getFiveMServer
} from '../utils/fivem';

export const data = new SlashCommandBuilder()
  .setName('idbak')
  .setDescription('FiveM sunucusunda ID ile oyuncu ismini bulur')
  .addIntegerOption(option =>
    option
      .setName('id')
      .setDescription('Bakılacak oyuncu ID')
      .setRequired(true)
      .setMinValue(1)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const id = interaction.options.getInteger('id', true);

  try {
    const players = await getFiveMPlayers();
    const player = players.find(player => player.id === id);

    if (!player) {
      await interaction.editReply(
        `❌ Bu ID ile online oyuncu bulunamadı: **${id}**`
      );
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('🎮 FiveM Oyuncu Bulundu')
      .addFields(
        { name: '🆔 ID', value: `${player.id}`, inline: true },
        { name: '👤 İsim', value: player.name || 'Bilinmiyor', inline: true },
        {
          name: '📶 Ping',
          value: player.ping !== undefined ? `${player.ping}` : 'Bilinmiyor',
          inline: true
        },
        { name: '🌐 Sunucu', value: getFiveMServer(), inline: false }
      )
      .setColor(0x2ecc71)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.editReply(
      '❌ FiveM verileri alınamadı. Sunucu kapalı olabilir veya dış erişim engellenmiş olabilir.'
    );
  }
}
