import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('yardim')
  .setDescription('Bot komutlarını gösterir');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({
    content: '**Komutlar:**\n`/ping` - Botu test eder\n`/yardim` - Komutları gösterir\n`/clear <miktar>` - Mesaj siler\n`/tagara <tag>` - FiveM sunucusundaki online oyuncularda tag/isim arar\n`/fivem` - Online oyuncu listesini gösterir\n`/idbak <id>` - ID numarasına göre oyuncu sorgular',
    ephemeral: true
  });
}
