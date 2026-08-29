"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const fivem_1 = require("../utils/fivem");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('idbak')
    .setDescription('FiveM sunucusunda ID ile oyuncu ismini bulur')
    .addIntegerOption(option => option
    .setName('id')
    .setDescription('Bakılacak oyuncu ID')
    .setRequired(true)
    .setMinValue(1));
async function execute(interaction) {
    await interaction.deferReply();
    const id = interaction.options.getInteger('id', true);
    try {
        const players = await (0, fivem_1.getFiveMPlayers)();
        const player = players.find(player => player.id === id);
        if (!player) {
            await interaction.editReply(`❌ Bu ID ile online oyuncu bulunamadı: **${id}**`);
            return;
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('🎮 FiveM Oyuncu Bulundu')
            .addFields({ name: '🆔 ID', value: `${player.id}`, inline: true }, { name: '👤 İsim', value: player.name || 'Bilinmiyor', inline: true }, {
            name: '📶 Ping',
            value: player.ping !== undefined ? `${player.ping}` : 'Bilinmiyor',
            inline: true
        }, { name: '🌐 Sunucu', value: (0, fivem_1.getFiveMServer)(), inline: false })
            .setColor(0x2ecc71)
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    }
    catch (error) {
        console.error(error);
        await interaction.editReply('❌ FiveM verileri alınamadı. Sunucu kapalı olabilir veya dış erişim engellenmiş olabilir.');
    }
}
