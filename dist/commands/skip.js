"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const musicManager_1 = require("../utils/musicManager");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('skip')
    .setDescription('Çalan şarkıyı geçer');
async function execute(interaction) {
    const result = (0, musicManager_1.skipSong)(interaction.guildId);
    await interaction.reply({
        content: result,
        ephemeral: true
    });
}
