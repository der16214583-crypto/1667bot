"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const musicManager_1 = require("../utils/musicManager");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('play')
    .setDescription('YouTube üzerinden şarkı açar')
    .addStringOption(option => option
    .setName('sarki')
    .setDescription('Şarkı adı veya YouTube linki')
    .setRequired(true));
async function execute(interaction) {
    await interaction.deferReply();
    const query = interaction.options.getString('sarki', true);
    const result = await (0, musicManager_1.addSong)(interaction, query);
    await interaction.editReply(result);
}
