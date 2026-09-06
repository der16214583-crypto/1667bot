"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('clear')
    .setDescription('Belirtilen miktarda mesaj siler')
    .addIntegerOption(option => option
    .setName('miktar')
    .setDescription('Silinecek mesaj sayısı')
    .setRequired(true)
    .setMinValue(1)
    .setMaxValue(100))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageMessages);
async function execute(interaction) {
    const amount = interaction.options.getInteger('miktar', true);
    if (!interaction.channel || !('bulkDelete' in interaction.channel)) {
        await interaction.reply({ content: 'Bu kanalda mesaj silemem.', ephemeral: true });
        return;
    }
    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `${amount} mesaj silindi.`, ephemeral: true });
}
