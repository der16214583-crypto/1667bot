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
  .setName('tagara')
  .setDescription('FiveM sunucusundaki online oyuncularda tag veya isim arar')
  .addStringOption(option =>
    option
      .setName('tag')
      .setDescription('Aranacak clan/birlik tagı veya oyuncu ismi')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const query = interaction.options.getString('tag', true).trim();

  if (!query) {
    await interaction.editReply('❌ Lütfen aranacak bir tag veya isim girin.');
    return;
  }

  try {
    const players = await getFiveMPlayers();

    if (!players || players.length === 0) {
      const emptyEmbed = new EmbedBuilder()
        .setTitle('🎮 FiveM Sunucu Durumu')
        .setDescription('Sunucuda şu an aktif/online hiçbir oyuncu bulunmuyor.')
        .setColor(0xe67e22)
        .addFields(
          { name: '🌐 Sunucu', value: `\`${getFiveMServer()}\``, inline: true },
          { name: '👥 Online Oyuncu', value: '`0`', inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [emptyEmbed] });
      return;
    }

    const searchLower = query.toLowerCase();
    const searchTr = query.toLocaleLowerCase('tr-TR');

    const results = players.filter(player => {
      if (!player.name) return false;
      const nameLower = player.name.toLowerCase();
      const nameTr = player.name.toLocaleLowerCase('tr-TR');
      return nameLower.includes(searchLower) || nameTr.includes(searchTr);
    });

    if (results.length === 0) {
      const notFoundEmbed = new EmbedBuilder()
        .setTitle('🔍 Tag Sorgulama - Sonuç Bulunamadı')
        .setDescription(
          `Sunucudaki **${players.length}** online oyuncu arasında **\`${query}\`** tagına veya ismine sahip oyuncu bulunamadı.`
        )
        .setColor(0xe74c3c)
        .addFields(
          { name: '🔍 Aranan Tag/İsim', value: `\`${query}\``, inline: true },
          { name: '👥 Toplam Online', value: `\`${players.length}\` Oyuncu`, inline: true },
          { name: '🌐 Sunucu', value: `\`${getFiveMServer()}\``, inline: false }
        )
        .setFooter({ text: 'FiveM Tag Arama Sistemi' })
        .setTimestamp();

      await interaction.editReply({ embeds: [notFoundEmbed] });
      return;
    }

    results.sort((a, b) => a.id - b.id);

    const playerRows = results.map(player => {
      const pingText = player.ping !== undefined ? `📶 \`${player.ping}ms\`` : '📶 `?`';
      return `🔹 **[ID: ${player.id}]** \`${player.name}\` — ${pingText}`;
    });

    const playerList = playerRows.join('\n');

    const resultEmbed = new EmbedBuilder()
      .setTitle(`🏷️ FiveM Tag Sorgulama: ${query}`)
      .setDescription(
        playerList.length > 3900
          ? playerList.slice(0, 3850) + '\n\n⚠️ *Liste çok uzun olduğu için kısaltıldı.*'
          : playerList
      )
      .setColor(0x3498db)
      .addFields(
        { name: '🔍 Aranan', value: `\`${query}\``, inline: true },
        { name: '🎯 Eşleşen', value: `**${results.length}** / ${players.length} Oyuncu`, inline: true },
        { name: '🌐 Sunucu', value: `\`${getFiveMServer()}\``, inline: true }
      )
      .setFooter({ text: `Toplam ${results.length} kişi bu taga/isme sahip • FiveM Canlı Sorgu` })
      .setTimestamp();

    await interaction.editReply({ embeds: [resultEmbed] });
  } catch (error: any) {
    console.error('Tag arama hatası:', error);

    const errorEmbed = new EmbedBuilder()
      .setTitle('❌ FiveM Verisi Alınamadı')
      .setDescription(
        'FiveM sunucusuna bağlanılamadı. Sunucu kapalı olabilir veya `players.json` dış erişimi engellenmiş olabilir.'
      )
      .setColor(0xd63031)
      .addFields(
        { name: '🌐 Hedef Sunucu', value: `\`${getFiveMServer()}\``, inline: true },
        { name: '⚠️ Hata Detayı', value: `\`${error.message || 'Bilinmeyen Hata'}\``, inline: false }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

