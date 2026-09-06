"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('yardim')
    .setDescription('Bot komutlarını gösterir');
async function execute(interaction) {
    await interaction.reply({
        content: '**Komutlar:**\n`/ping` - Botu test eder\n`/yardim` - Komutları gösterir\n`/clear <miktar>` - Mesaj siler\n`/tagara <tag>` - FiveM sunucusundaki online oyuncularda tag/isim arar\n`/fivem` - Online oyuncu listesini gösterir\n`/idbak <id>` - ID numarasına göre oyuncu sorgular',
        ephemeral: true
    });
}
