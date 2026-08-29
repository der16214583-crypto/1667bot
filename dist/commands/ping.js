"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun çalışıp çalışmadığını kontrol eder');
async function execute(interaction) {
    await interaction.reply('🏓 Pong!');
}
