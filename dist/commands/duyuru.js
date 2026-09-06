"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const DUYURU_KANAL_ID = '1469847516118777866';
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('duyuru')
    .setDescription('Duyuru gönderir')
    .addStringOption(option => option
    .setName('mesaj')
    .setDescription('Duyuru mesajı')
    .setRequired(true))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageMessages);
async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const mesaj = interaction.options.getString('mesaj', true);
    const kanal = await interaction.guild?.channels.fetch(DUYURU_KANAL_ID).catch(() => null);
    if (!kanal || !('send' in kanal)) {
        await interaction.editReply('Duyuru kanalı bulunamadı.');
        return;
    }
    await kanal.send({
        content: `@everyone\n\n📢 **DUYURU**\n\n${mesaj}`
    });
    await interaction.editReply('✅ Duyuru gönderildi.');
}
