"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const fivem_1 = require("../utils/fivem");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('fivem')
    .setDescription('FiveM sunucusundaki online oyuncuları gösterir');
async function execute(interaction) {
    await interaction.deferReply();
    try {
        const players = await (0, fivem_1.getFiveMPlayers)();
        if (!players.length) {
            await interaction.editReply('Sunucuda şu an online oyuncu yok.');
            return;
        }
        const playerList = players
            .sort((a, b) => a.id - b.id)
            .map(player => `**ID:** ${player.id} | **İsim:** ${player.name || 'Bilinmiyor'}`)
            .join('\n');
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('🎮 FiveM Online Oyuncular')
            .setDescription(playerList.length > 4000
            ? playerList.slice(0, 3900) +
                '\n\n⚠️ Liste çok uzun olduğu için kısaltıldı.'
            : playerList)
            .addFields({ name: '🌐 Sunucu', value: (0, fivem_1.getFiveMServer)(), inline: true }, { name: '👥 Online', value: `${players.length}`, inline: true })
            .setColor(0x2ecc71)
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    }
    catch (error) {
        console.error(error);
        await interaction.editReply('❌ FiveM verileri alınamadı. Sunucu kapalı olabilir veya dış erişim engellenmiş olabilir.');
    }
}
