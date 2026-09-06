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
  .setName('fivem')
  .setDescription('FiveM sunucusundaki online oyuncuları gösterir');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const players = await getFiveMPlayers();

    if (!players.length) {
      await interaction.editReply('Sunucuda şu an online oyuncu yok.');
      return;
    }

    const playerList = players
      .sort((a, b) => a.id - b.id)
      .map(
        player =>
          `**ID:** ${player.id} | **İsim:** ${player.name || 'Bilinmiyor'}`
      )
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle('🎮 FiveM Online Oyuncular')
      .setDescription(
        playerList.length > 4000
          ? playerList.slice(0, 3900) +
            '\n\n⚠️ Liste çok uzun olduğu için kısaltıldı.'
          : playerList
      )
      .addFields(
        { name: '🌐 Sunucu', value: getFiveMServer(), inline: true },
        { name: '👥 Online', value: `${players.length}`, inline: true }
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
