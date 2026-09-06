"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const musicManager_1 = require("../utils/musicManager");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('queue')
    .setDescription('Müzik sırasını gösterir');
async function execute(interaction) {
    const list = (0, musicManager_1.queueList)(interaction.guildId);
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('🎵 Müzik Sırası')
        .setDescription(list)
        .setColor(0x2ecc71)
        .setTimestamp();
    await interaction.reply({
        embeds: [embed],
        ephemeral: true
    });
}
