"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
// Dünkü bot yapına göre: data + execute export
// /telsiz komutunu kullanınca butonlu panel gönderir.
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('telsiz')
    .setDescription('Telsiz kodu paneli gönderir')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.MentionEveryone);
async function execute(interaction) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('📻 Telsiz Kodu Paneli')
        .setDescription('Aşağıdaki butona basınca rastgele telsiz kodu oluşturulur ve @everyone olarak duyurulur.')
        .setColor(0xff0000);
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('telsiz_kodu_ver')
        .setLabel('📻 Telsiz Kodu Ver')
        .setStyle(discord_js_1.ButtonStyle.Danger));
    await interaction.reply({
        embeds: [embed],
        components: [row]
    });
}
