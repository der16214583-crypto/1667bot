import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Botun çalışıp çalışmadığını kontrol eder');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply('🏓 Pong!');
}
